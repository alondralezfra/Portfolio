class FluidDynamicsSolver {
  public N: number;
  private size: number;
  private dt: number;
  private diff: number;
  private visc: number;
  public u: Float32Array;
  public v: Float32Array;
  private uPrev: Float32Array;
  private vPrev: Float32Array;
  public dens: Float32Array;
  private densPrev: Float32Array;

  constructor(N: number, dt: number, diff: number, visc: number) {
    this.N = N;
    this.dt = dt;
    this.diff = diff;
    this.visc = visc;
    this.size = (N + 2) * (N + 2);
    this.u = new Float32Array(this.size);
    this.v = new Float32Array(this.size);
    this.uPrev = new Float32Array(this.size);
    this.vPrev = new Float32Array(this.size);
    this.dens = new Float32Array(this.size);
    this.densPrev = new Float32Array(this.size);
  }

  public IX(i: number, j: number): number {
    return i + (this.N + 2) * j;
  }

  public addSource(x: Float32Array, s: Float32Array): void {
    for (let i = 0; i < this.size; i++) {
      x[i] += this.dt * s[i];
    }
  }
  public addDensity(x: number, y: number, amount: number): void {
    const index = this.IX(x, y);
    this.dens[index] += amount;
  }

  public addVelocity(x: number, y: number, amountX: number, amountY: number): void {
    const index = this.IX(x, y);
    this.u[index] += amountX;
    this.v[index] += amountY;
  }

  decayDensity(decayFactor: number): void {
    for (let i = 0; i < this.dens.length; i++) {
      this.dens[i] *= decayFactor;
    }
  }

  decayDensityNumber(decayFactor: number): void {
    for (let i = 0; i < this.dens.length; i++) {
      this.dens[i] -= decayFactor;
      if (this.dens[i] < 0) {
        this.dens[i] = 0;
      }
    }
  }

  public diffuse(b: number, x: Float32Array, x0: Float32Array, diff: number): void {
    let a = this.dt * diff * this.N * this.N;
    for (let k = 0; k < 20; k++) {
      for (let i = 1; i <= this.N; i++) {
        for (let j = 1; j <= this.N; j++) {
          x[this.IX(i, j)] = (x0[this.IX(i, j)] + a * (x[this.IX(i - 1, j)] + x[this.IX(i + 1, j)] + x[this.IX(i, j - 1)] + x[this.IX(i, j + 1)])) / (1 + 4 * a);
        }
      }
      this.setBnd(b, x);
    }
  }

  public advect(b: number, d: Float32Array, d0: Float32Array, u: Float32Array, v: Float32Array): void {
    let i0, j0, i1, j1;
    let x, y, s0, t0, s1, t1, dt0;

    dt0 = this.dt * this.N;
    for (let i = 1; i <= this.N; i++) {
      for (let j = 1; j <= this.N; j++) {
        x = i - dt0 * u[this.IX(i, j)];
        y = j - dt0 * v[this.IX(i, j)];
        if (x < 0.5) x = 0.5;
        if (x > this.N + 0.5) x = this.N + 0.5;
        i0 = Math.floor(x);
        i1 = i0 + 1;
        if (y < 0.5) y = 0.5;
        if (y > this.N + 0.5) y = this.N + 0.5;
        j0 = Math.floor(y);
        j1 = j0 + 1;

        s1 = x - i0;
        s0 = 1 - s1;
        t1 = y - j0;
        t0 = 1 - t1;

        d[this.IX(i, j)] = s0 * (t0 * d0[this.IX(i0, j0)] + t1 * d0[this.IX(i0, j1)]) +
          s1 * (t0 * d0[this.IX(i1, j0)] + t1 * d0[this.IX(i1, j1)]);
      }
    }
    this.setBnd(b, d);
  }

  public project(u: Float32Array, v: Float32Array, p: Float32Array, div: Float32Array): void {
    let h = 1.0 / this.N;
    for (let i = 1; i <= this.N; i++) {
      for (let j = 1; j <= this.N; j++) {
        div[this.IX(i, j)] = -0.5 * h * (u[this.IX(i + 1, j)] - u[this.IX(i - 1, j)] +
          v[this.IX(i, j + 1)] - v[this.IX(i, j - 1)]);
        p[this.IX(i, j)] = 0;
      }
    }

    this.setBnd(0, div);
    this.setBnd(0, p);

    for (let k = 0; k < 20; k++) {
      for (let i = 1; i <= this.N; i++) {
        for (let j = 1; j <= this.N; j++) {
          p[this.IX(i, j)] = (div[this.IX(i, j)] +
            p[this.IX(i - 1, j)] + p[this.IX(i + 1, j)] +
            p[this.IX(i, j - 1)] + p[this.IX(i, j + 1)]) / 4;
        }
      }
      this.setBnd(0, p);
    }

    for (let i = 1; i <= this.N; i++) {
      for (let j = 1; j <= this.N; j++) {
        u[this.IX(i, j)] -= 0.5 * (p[this.IX(i + 1, j)] - p[this.IX(i - 1, j)]) / h;
        v[this.IX(i, j)] -= 0.5 * (p[this.IX(i, j + 1)] - p[this.IX(i, j - 1)]) / h;
      }
    }

    this.setBnd(1, u);
    this.setBnd(2, v);
  }

  private setBnd(b: number, x: Float32Array): void {
    for (let i = 1; i <= this.N; i++) {
      x[this.IX(0, i)] = b === 1 ? -x[this.IX(1, i)] : x[this.IX(1, i)];
      x[this.IX(this.N + 1, i)] = b === 1 ? -x[this.IX(this.N, i)] : x[this.IX(this.N, i)];
      x[this.IX(i, 0)] = b === 2 ? -x[this.IX(i, 1)] : x[this.IX(i, 1)];
      x[this.IX(i, this.N + 1)] = b === 2 ? -x[this.IX(i, this.N)] : x[this.IX(i, this.N)];
    }
    x[this.IX(0, 0)] = 0.5 * (x[this.IX(1, 0)] + x[this.IX(0, 1)]);
    x[this.IX(0, this.N + 1)] = 0.5 * (x[this.IX(1, this.N + 1)] + x[this.IX(0, this.N)]);
    x[this.IX(this.N + 1, 0)] = 0.5 * (x[this.IX(this.N, 0)] + x[this.IX(this.N + 1, 1)]);
    x[this.IX(this.N + 1, this.N + 1)] = 0.5 * (x[this.IX(this.N, this.N + 1)] + x[this.IX(this.N + 1, this.N)]);
  }

  public densStep(x: Float32Array, x0: Float32Array, u: Float32Array, v: Float32Array, diff: number): void {
    this.swap(x0, x);
    this.diffuse(0, x, x0, diff);
    this.swap(x0, x);
    this.advect(0, x, x0, u, v);
  }

  public velStep(u: Float32Array, v: Float32Array, u0: Float32Array, v0: Float32Array, visc: number): void {
    this.swap(u0, u);
    this.diffuse(1, u, u0, visc);
    this.swap(v0, v);
    this.diffuse(2, v, v0, visc);
    this.project(u, v, u0, v0);
    this.swap(u0, u);
    this.swap(v0, v);
    this.advect(1, u, u0, u0, v0);
    this.advect(2, v, v0, u0, v0);
    this.project(u, v, u0, v0);
  }

  private swap(a: Float32Array, b: Float32Array): void {
    const temp = a.slice();
    a.set(b);
    b.set(temp);
  }

  public simulate(): void {
    this.velStep(this.u, this.v, this.uPrev, this.vPrev, this.visc);
    this.densStep(this.dens, this.densPrev, this.u, this.v, this.diff);
    this.decayDensity(0.999);
  }
}
export default FluidDynamicsSolver;