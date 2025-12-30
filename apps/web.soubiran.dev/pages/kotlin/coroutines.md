# Coroutines & Concurrency

## Recap

| Concept | Description | Use Case |
|---------|-------------|----------|
| **suspend** | Function modifier allowing suspension | Long-running operations (IO, CPU) |
| **launch** | Builder that returns a `Job` (fire-and-forget) | Operations that don't return a result |
| **async** | Builder that returns a `Deferred` (future) | Parallel operations returning a result |
| **Dispatcher** | Thread pool manager | `IO` (DB/Net), `Default` (CPU), `Main` (UI) |
| **Scope** | Lifecycle manager | `viewModelScope`, `lifecycleScope`, `GlobalScope` |
| **Flow** | Asynchronous cold stream | Reactive data streams |

---

## What are Coroutines?

Coroutines are "lightweight threads". They allow you to write asynchronous, non-blocking code using synchronous syntax.

### Suspend Functions

Functions marked with `suspend` can pause execution without blocking the underlying thread.

```kotlin
suspend fun fetchData(): String {
    delay(1000) // Suspends coroutine for 1s, doesn't block thread
    return "Data"
}
```

---

## Coroutine Builders

Builders start a new coroutine. They must be called from a `CoroutineScope`.

### launch (Fire and Forget)

Returns a `Job`. Use when you don't need a result.

```kotlin
scope.launch {
    val data = fetchData()
    println(data)
}
```

### async (Concurrency)

Returns a `Deferred<T>`. Use when you need a result or want parallel execution.

```kotlin
scope.launch {
    val deferred1 = async { fetchData1() }
    val deferred2 = async { fetchData2() }

    // Wait for both
    val result = deferred1.await() + deferred2.await()
}
```

### runBlocking (Bridging)

Blocks the current thread until the coroutine completes. Use **only** in `main` functions or tests.

```kotlin
fun main() = runBlocking {
    val data = fetchData()
    println(data)
}
```

---

## Dispatchers

Dispatchers determine which thread the coroutine runs on.

| Dispatcher | Purpose | Backed By |
|------------|---------|-----------|
| **Dispatchers.Main** | UI updates | Main/UI Thread |
| **Dispatchers.IO** | Network, Disk, Database | Thread Pool (64+ threads) |
| **Dispatchers.Default** | CPU-intensive tasks (sorting, parsing) | Thread Pool (CPU cores) |
| **Dispatchers.Unconfined** | Starts in current thread, resumes anywhere | Advanced use cases |

### Switching Context

Use `withContext` to switch dispatchers safely.

```kotlin
suspend fun loadUser() = withContext(Dispatchers.IO) {
    // Runs on IO thread
    database.getUser()
} // Automatically returns to original dispatcher
```

---

## Structured Concurrency

Structured concurrency ensures no coroutine is lost. A parent coroutine waits for all its children to complete.

### coroutineScope

Creates a new scope. If one child fails, all are cancelled.

```kotlin
suspend fun loadData() = coroutineScope {
    val user = async { api.getUser() }
    val posts = async { api.getPosts() }

    UserWithPosts(user.await(), posts.await())
}
```

**Benefits**:
- **No Leaks**: If `loadData` returns, all work is done.
- **Error Handling**: If `getUser` fails, `getPosts` is cancelled automatically.

---

## Flow (Asynchronous Streams)

`Flow` is a stream of values that are computed asynchronously. It's "cold" (lazy)—code doesn't run until you collect.

### Creating a Flow

```kotlin
fun simpleFlow(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // Asynchronous work
        emit(i)    // Emit value
    }
}
```

### Collecting a Flow

```kotlin
scope.launch {
    simpleFlow()
        .map { it * 2 }      // Transform
        .filter { it > 2 }   // Filter
        .collect { value ->  // Terminal operator
            println(value)
        }
}
```

### StateFlow vs SharedFlow

- **StateFlow**: Holds a single up-to-date value (like `LiveData`). Hot stream.
- **SharedFlow**: Broadcasts events to multiple subscribers. Hot stream.

```kotlin
class ViewModel {
    private val _state = MutableStateFlow(InitialState)
    val state: StateFlow<State> = _state.asStateFlow()

    fun update() {
        _state.value = NewState
    }
}
```
