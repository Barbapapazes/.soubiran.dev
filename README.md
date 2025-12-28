# AI Agent Workflow for Learning & Documentation

This directory contains the definitions for the AI Agents used in the `infra.soubiran.dev` project. These agents are designed to work together to create a high-quality, structured, and interactive "Digital Garden" for learning.

## The Agents

### Teacher (`teacher.agent.md`)

- **Role**: The primary interface and content improver.
- **Responsibility**: Takes raw notes, improves explanations, fixes code, and ensures pedagogical quality.
- **When to use**: Start here with your raw notes.
- **Key Actions**: Improves text, calls `Visualizer`, calls `Content-Architect`.

### Visualizer (`visualizer.agent.md`)

- **Role**: The technical illustrator.
- **Responsibility**: Converts complex text descriptions into Mermaid.js diagrams.
- **When to use**: When a concept is too abstract or complex for text alone.
- **Key Actions**: Generates Flowcharts, Sequence Diagrams, etc.

### Content-Architect (`content-architect.agent.md`)

- **Role**: The structural organizer.
- **Responsibility**: Splits monolithic content into atomic "flashcards" and organizes folders.
- **When to use**: After the content has been improved by the Teacher.
- **Key Actions**: Splits files, creates directories, organizes hierarchy.

### Examiner (`examiner.agent.md`)

- **Role**: The active recall tester.
- **Responsibility**: Generates quizzes and code challenges to test your understanding.
- **When to use**: After the content is structured and finalized.
- **Key Actions**: Creates `quiz-*.md` files with hidden answers.

## The Workflow

The standard workflow for adding new learning material is:

1.  **Draft**: You write raw notes in a markdown file (e.g., `drafts/my-topic.md`).
2.  **Refine (Teacher)**:
    - You ask the **Teacher**: "Please improve these notes on [Topic]."
    - The Teacher refines the text, adds code examples, and adds a Recap.
    - *Automatic*: The Teacher may call the **Visualizer** to add diagrams for complex parts.
3.  **Structure (Content-Architect)**:
    - The Teacher (or you) asks the **Content-Architect**: "Split this into flashcards."
    - The Architect breaks the file into smaller, atomic files (e.g., `topic/concept-a.md`, `topic/concept-b.md`).
4.  **Test (Examiner)**:
    - You ask the **Examiner**: "Create a quiz for this topic."
    - The Examiner reads the new flashcards and generates a quiz file.

## Usage Tips

- **Inter-Agent Communication**: The agents are aware of each other. The Teacher is the best entry point as it can orchestrate the others.
- **Context**: Always provide the path to the files you want them to work on.
- **Feedback**: If an agent makes a mistake, correct it immediately so it stays on track.
