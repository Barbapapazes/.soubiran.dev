# Garbage Collection

Garbage Collection (GC) is the process of automatic memory management in Java. It relieves developers from the burden of manually allocating and freeing memory, which eliminates entire classes of bugs like memory leaks and dangling pointers.

## How it Works
The GC has two primary responsibilities:
1.  **Allocation**: Providing a fast way to allocate memory for new objects.
2.  **Reclamation**: Identifying objects that are no longer needed (dead objects) and reclaiming their memory.

The GC determines if an object is "live" by tracing the **object graph**. It starts from "GC Roots" (e.g., local variables, static fields) and traverses references. Any object that cannot be reached from a GC Root is considered garbage.

## The Generational Hypothesis
Most Garbage Collectors are built around the **Generational Hypothesis**, which states that:
> "Most objects die young."

Based on this, the heap is divided into two main areas:
-   **Young Generation**: Where new objects are allocated. Collections here are frequent and fast (Minor GC).
-   **Old Generation**: Where long-lived objects are moved after surviving multiple collections in the Young Generation. Collections here are less frequent but more expensive (Major GC).

## GC Types (OpenJDK)

You can choose different GC algorithms based on your application's needs:

-   **Serial GC**: A simple, single-threaded collector. It has the lowest memory footprint but pauses the application during collection. Ideal for small applications or microservices running with limited resources.
-   **Parallel GC**: Focuses on **throughput**. It uses multiple threads for garbage collection but still pauses the application (Stop-The-World). Good for batch processing.
-   **G1 GC (Garbage First)**: The default collector since JDK 9. It balances **throughput** and **latency**. It splits the heap into regions and prioritizes collecting regions with the most garbage.
-   **ZGC**: A scalable, low-latency collector. It performs most work concurrently with the application threads, keeping pause times under a millisecond, even on multi-terabyte heaps.

## Tuning Trade-offs
There is no "perfect" GC. You must trade off between three factors:
1.  **Throughput**: The percentage of total time spent running the application vs. running the GC.
2.  **Latency**: The responsiveness of the application (impacted by pause times).
3.  **Footprint**: The amount of memory required by the GC process itself.
