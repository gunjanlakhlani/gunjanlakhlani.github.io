#include <stdlib.h>
#include <math.h>
#include <stdint.h>
#include <string.h>
#include <emscripten.h>

#define SOFTENING 1e-4
#define BH_THETA 0.7
#define BH_THETA_SQ (BH_THETA * BH_THETA)

// MAX_NODES: 4 million to comfortably fit 100K very dense points
#define MAX_NODES 4000000

// Struct of Arrays for tree nodes (better cache locality)
double node_cx[MAX_NODES];
double node_cy[MAX_NODES];
double node_half[MAX_NODES];
double node_mass[MAX_NODES];
double node_com_x[MAX_NODES];
double node_com_y[MAX_NODES];
int node_count[MAX_NODES];
int node_body[MAX_NODES];
int node_children[MAX_NODES * 4];

int node_pool_size = 0;

int alloc_node(double cx, double cy, double half) {
    if (node_pool_size >= MAX_NODES) return -1; // Panic
    int id = node_pool_size++;
    node_cx[id] = cx;
    node_cy[id] = cy;
    node_half[id] = half;
    node_mass[id] = 0.0;
    node_com_x[id] = 0.0;
    node_com_y[id] = 0.0;
    node_count[id] = 0;
    node_body[id] = -1;
    int ci = id * 4;
    node_children[ci] = -1;
    node_children[ci + 1] = -1;
    node_children[ci + 2] = -1;
    node_children[ci + 3] = -1;
    return id;
}

static inline int get_quadrant(int nid, double px, double py) {
    if (px < node_cx[nid]) {
        return py >= node_cy[nid] ? 0 : 2;
    } else {
        return py >= node_cy[nid] ? 1 : 3;
    }
}

// Forward declare
void insert_body(int nid, int idx, double* x, double* y, double* mass);

void subdivide(int nid, double* x, double* y, double* mass) {
    double hs = node_half[nid] * 0.5;
    double cx = node_cx[nid], cy = node_cy[nid];
    int ci = nid * 4;
    
    int nw = alloc_node(cx - hs, cy + hs, hs);
    int ne = alloc_node(cx + hs, cy + hs, hs);
    int sw = alloc_node(cx - hs, cy - hs, hs);
    int se = alloc_node(cx + hs, cy - hs, hs);
    
    // If we ran out of nodes, we just return (nodes will remain -1)
    if (nw == -1 || ne == -1 || sw == -1 || se == -1) return;

    node_children[ci + 0] = nw;
    node_children[ci + 1] = ne;
    node_children[ci + 2] = sw;
    node_children[ci + 3] = se;

    int old_idx = node_body[nid];
    if (old_idx >= 0) {
        node_body[nid] = -1;
        int q = get_quadrant(nid, x[old_idx], y[old_idx]);
        insert_body(node_children[ci + q], old_idx, x, y, mass);
    }
}

void insert_body(int nid, int idx, double* x, double* y, double* mass) {
    if (nid == -1) return; // Out of memory protection

    if (node_count[nid] == 0) {
        node_body[nid] = idx;
        node_mass[nid] = mass[idx];
        node_com_x[nid] = x[idx];
        node_com_y[nid] = y[idx];
        node_count[nid] = 1;
        return;
    }

    int ci = nid * 4;
    if (node_children[ci] == -1) {
        subdivide(nid, x, y, mass);
    }

    if (node_children[ci] != -1) {
        int q = get_quadrant(nid, x[idx], y[idx]);
        insert_body(node_children[ci + q], idx, x, y, mass);
    }

    double totalM = node_mass[nid] + mass[idx];
    node_com_x[nid] = (node_com_x[nid] * node_mass[nid] + x[idx] * mass[idx]) / totalM;
    node_com_y[nid] = (node_com_y[nid] * node_mass[nid] + y[idx] * mass[idx]) / totalM;
    node_mass[nid] = totalM;
    node_count[nid]++;
}

EMSCRIPTEN_KEEPALIVE
int build_tree(int N, double* x, double* y, double* mass) {
    node_pool_size = 0;

    double min_x = 1e30, max_x = -1e30, min_y = 1e30, max_y = -1e30;
    for (int i = 0; i < N; i++) {
        if (x[i] < min_x) min_x = x[i];
        if (x[i] > max_x) max_x = x[i];
        if (y[i] < min_y) min_y = y[i];
        if (y[i] > max_y) max_y = y[i];
    }
    double dx = max_x - min_x, dy = max_y - min_y;
    double max_d = (dx > dy) ? dx : dy;
    double half = max_d * 0.55 + 0.1;
    double cx = (min_x + max_x) * 0.5;
    double cy = (min_y + max_y) * 0.5;

    int root = alloc_node(cx, cy, half);
    for (int i = 0; i < N; i++) {
        insert_body(root, i, x, y, mass);
    }
    return root;
}

int tree_stack[1024];

void compute_force_from_tree(int root, double bx, double by, double* ax, double* ay) {
    double fax = 0.0, fay = 0.0;
    int stack_top = 0;
    tree_stack[stack_top++] = root;

    while (stack_top > 0) {
        int nid = tree_stack[--stack_top];
        if (nid == -1 || node_count[nid] == 0) continue;

        double dx = node_com_x[nid] - bx;
        double dy = node_com_y[nid] - by;
        double r2 = dx * dx + dy * dy + SOFTENING;

        if (node_count[nid] == 1) {
            if (r2 < SOFTENING * 2.0) continue;
            double rInv = 1.0 / sqrt(r2);
            double r3Inv = rInv * rInv * rInv;
            fax += node_mass[nid] * dx * r3Inv; // G=1.0
            fay += node_mass[nid] * dy * r3Inv;
            continue;
        }

        double s = node_half[nid] * 2.0;
        if (s * s < BH_THETA_SQ * r2) {
            double rInv = 1.0 / sqrt(r2);
            double r3Inv = rInv * rInv * rInv;
            fax += node_mass[nid] * dx * r3Inv;
            fay += node_mass[nid] * dy * r3Inv;
            continue;
        }

        int ci = nid * 4;
        for (int c = 0; c < 4; c++) {
            if (node_children[ci + c] != -1) {
                tree_stack[stack_top++] = node_children[ci + c];
            }
        }
    }
    *ax = fax;
    *ay = fay;
}

EMSCRIPTEN_KEEPALIVE
void compute_forces_bh(int N, double* x, double* y, double* ax, double* ay, double* mass) {
    int root = build_tree(N, x, y, mass);
    for (int i = 0; i < N; i++) {
        double fax, fay;
        compute_force_from_tree(root, x[i], y[i], &fax, &fay);
        ax[i] = fax;
        ay[i] = fay;
    }
}

EMSCRIPTEN_KEEPALIVE
void compute_forces_direct(int N, double* x, double* y, double* ax, double* ay, double* mass) {
    for (int i = 0; i < N; i++) {
        ax[i] = 0.0;
        ay[i] = 0.0;
    }
    for (int i = 0; i < N; i++) {
        double axi = 0.0, ayi = 0.0;
        for (int j = i + 1; j < N; j++) {
            double dx = x[j] - x[i];
            double dy = y[j] - y[i];
            double r2 = dx * dx + dy * dy + SOFTENING;
            double rInv = 1.0 / sqrt(r2);
            double r3Inv = rInv * rInv * rInv;
            double fx = dx * r3Inv; // G=1.0
            double fy = dy * r3Inv;
            axi += mass[j] * fx;
            ayi += mass[j] * fy;
            ax[j] -= mass[i] * fx;
            ay[j] -= mass[i] * fy;
        }
        ax[i] += axi;
        ay[i] += ayi;
    }
}

EMSCRIPTEN_KEEPALIVE
void leapfrog_step(int N, double dt, double* x, double* y, double* vx, double* vy, double* ax, double* ay, double* mass) {
    double hdt = 0.5 * dt;
    for (int i = 0; i < N; i++) {
        vx[i] += hdt * ax[i];
        vy[i] += hdt * ay[i];
        x[i] += dt * vx[i];
        y[i] += dt * vy[i];
    }
    
    if (N > 200) {
        compute_forces_bh(N, x, y, ax, ay, mass);
    } else {
        compute_forces_direct(N, x, y, ax, ay, mass);
    }

    for (int i = 0; i < N; i++) {
        vx[i] += hdt * ax[i];
        vy[i] += hdt * ay[i];
    }
}

EMSCRIPTEN_KEEPALIVE
double compute_energy(int N, double* x, double* y, double* vx, double* vy, double* mass) {
    double ke = 0.0, pe = 0.0;
    for (int i = 0; i < N; i++) {
        ke += 0.5 * mass[i] * (vx[i] * vx[i] + vy[i] * vy[i]);
    }
    if (N > 500) return ke; // O(N^2) PE is too slow for large N
    
    for (int i = 0; i < N; i++) {
        for (int j = i + 1; j < N; j++) {
            double dx = x[j] - x[i];
            double dy = y[j] - y[i];
            double r = sqrt(dx * dx + dy * dy + SOFTENING);
            pe -= mass[i] * mass[j] / r;
        }
    }
    return ke + pe;
}
