
# Python

The GIL (Global Interpreter Lock) is a mutex that allows only ONE thread to execute Python bytecode at a time per process.

Threads can release the GIL during I/O, C extension calls or PyTorch GPU runs.

The Three Parallelism Models

1. Threads (threading, ThreadPoolExecutor)

- Same process, shared memory, shared GIL
- Good for: I/O-bound tasks, releasing GIL during C extensions (PyTorch GPU ops, cv2)
- Bad for: CPU-bound Python (GIL serializes)
- In this project: initialize.py uses threads to load all models concurrently — this works because model
  loading is mostly I/O + C-extension time. run.py Layer 1 uses threads to run RT-DETR + DeepLSD + SAM3
on the same image simultaneously.

2. Subprocesses (multiprocessing, mp.Pool)

- Separate processes, separate memory, separate GIL
- Good for: CPU-bound Python, CUDA-safe parallelism, true isolation
- Bad for: large data sharing (IPC serialization cost), high startup overhead
- CUDA rule: always use spawn context, never fork — CUDA contexts are not fork-safe
- In this project: SAM3Pool uses mp.get_context('spawn').Pool so each worker has its own SAM3 instance
and GPU

3. Async (asyncio)

- Single thread, cooperative multitasking
- Good for: many concurrent I/O operations (web requests, disk)
- Bad for: CPU-bound or GPU-bound work (it's still single-threaded)
- Not useful for ML inference