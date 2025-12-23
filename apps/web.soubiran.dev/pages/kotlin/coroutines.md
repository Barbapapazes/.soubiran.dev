# Coroutines & Concurrency

Kotlin Coroutines provide a way to write asynchronous, non-blocking code that looks like synchronous code.

## Key Concepts

- **Suspend Functions**: Functions marked with `suspend` can be paused without blocking the thread.
- **CoroutineScope**: Defines the lifetime of coroutines.
- **Dispatcher**: Determines which thread or thread pool the coroutine runs on (e.g., `Dispatchers.IO`, `Dispatchers.Main`).
- **Job**: A handle to a coroutine that can be used to cancel it.
- **Deferred**: A `Job` that returns a result (similar to `Future` or `Promise`).

## Structured Concurrency

Kotlin enforces structured concurrency, meaning new coroutines can only be launched in a specific `CoroutineScope` which delimits the lifetime of the coroutine. This ensures that coroutines are not leaked and are properly cancelled when their scope is destroyed.

## Flow

`Flow` is a cold asynchronous data stream that sequentially emits values and completes normally or with an exception. It is similar to `Streams` in Java but built on top of coroutines.
