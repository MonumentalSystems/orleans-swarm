#!/usr/bin/env tsx
/**
 * Research Task Dispatcher
 *
 * Dispatches the Orleans research task to the swarm using parallel strategy.
 * Decomposes the task into 5 independent subtasks that can run simultaneously.
 */

import * as fs from "fs";
import * as path from "path";
import { TaskAgent, TaskConfig } from "./src/agents/task-agent.js";
import { getGlobalLogger } from "./src/utils/logger.js";

const logger = getGlobalLogger();

interface TaskStore {
  tasks: Record<string, any>;
  version: string;
}

interface Subtask {
  id: string;
  taskId: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  assignedTo?: string;
  result?: string;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

/**
 * Load task from .tasks directory
 */
function loadTask(taskFile: string): any {
  const filePath = path.join(process.cwd(), ".tasks", taskFile);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Task file not found: ${filePath}`);
  }
  
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content);
}

/**
 * Save task to .tasks directory
 */
function saveTask(taskFile: string, task: any): void {
  const filePath = path.join(process.cwd(), ".tasks", taskFile);
  fs.writeFileSync(filePath, JSON.stringify(task, null, 2), "utf8");
}

/**
 * Load the main task store
 */
function loadTaskStore(): TaskStore {
  const storePath = path.join(process.cwd(), ".claude-flow/tasks/store.json");
  
  if (!fs.existsSync(storePath)) {
    return { tasks: {}, version: "3.0.0" };
  }
  
  const content = fs.readFileSync(storePath, "utf8");
  return JSON.parse(content);
}

/**
 * Save task to store
 */
function saveTaskToStore(store: TaskStore): void {
  const storePath = path.join(process.cwd(), ".claude-flow/tasks/store.json");
  
  // Ensure directory exists
  const dir = path.dirname(storePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
}

/**
 * Create subtasks for parallel execution
 */
function createSubtasks(task: any): Subtask[] {
  const now = new Date().toISOString();
  
  return [
    {
      id: "SUBTASK-orleans-1",
      taskId: task.taskId,
      title: "Research Virtual Actor Model and Grains",
      description: "Investigate how Orleans implements the Virtual Actor Model, grain lifecycle, activation/deactivation, and grain identity. Focus on understanding how grains work conceptually and practically.",
      status: "pending",
      createdAt: now,
    },
    {
      id: "SUBTASK-orleans-2",
      taskId: task.taskId,
      title: "Research Persistence and State Management",
      description: "Explore grain state persistence options, storage providers (Azure, SQL, DynamoDB, etc.), transaction support, and consistency models. Document how Orleans handles state across distributed instances.",
      status: "pending",
      createdAt: now,
    },
    {
      id: "SUBTASK-orleans-3",
      taskId: task.taskId,
      title: "Research Communication Patterns",
      description: "Study grain-to-grain messaging, streaming API, timers, reminders, and message delivery guarantees. Understand how Orleans handles asynchronous communication between actors.",
      status: "pending",
      createdAt: now,
    },
    {
      id: "SUBTASK-orleans-4",
      taskId: task.taskId,
      title: "Research Distributed Systems Capabilities",
      description: "Investigate clustering, silo architecture, membership protocols (Azure Service Fabric, ZooKeeper, etc.), scaling, and fault tolerance mechanisms. Document how Orleans handles node failures and network partitions.",
      status: "pending",
      createdAt: now,
    },
    {
      id: "SUBTASK-orleans-5",
      taskId: task.taskId,
      title: "Synthesize Relevance for Agent Swarm Coordination",
      description: "Analyze how Orleans capabilities map to distributed agent swarm coordination requirements. Provide actionable insights on using Orleans for building agent coordination systems.",
      status: "pending",
      createdAt: now,
    },
  ];
}

/**
 * Display task header
 */
function displayHeader(task: any): void {
  console.log("=".repeat(80));
  console.log("RESEARCH TASK DISPATCH - PARALLEL STRATEGY");
  console.log("=".repeat(80));
  console.log();
  console.log("Task Details:");
  console.log(`  Task ID:       ${task.taskId}`);
  console.log(`  Type:          ${task.type}`);
  console.log(`  Priority:      ${task.priority}`);
  console.log(`  Status:        ${task.status} → dispatching`);
  console.log();
  console.log("Description:");
  console.log(`  ${task.description.substring(0, 200)}...`);
  console.log();
  console.log("Execution Strategy:");
  console.log(`  Approach:      Parallel execution of 5 subtasks`);
  console.log(`  Subtasks:      5 independent research areas`);
  console.log(`  Output Path:   ${task.targetPath}`);
  console.log();
  console.log("-".repeat(80));
  console.log();
}

/**
 * Display subtasks
 */
function displaySubtasks(subtasks: Subtask[]): void {
  console.log("SUBTASKS CREATED (Parallel Execution):");
  console.log();
  
  subtasks.forEach((subtask, index) => {
    console.log(`${index + 1}. ${subtask.id}`);
    console.log(`   Title:       ${subtask.title}`);
    console.log(`   Description: ${subtask.description.substring(0, 80)}...`);
    console.log(`   Status:      ${subtask.status}`);
    console.log();
  });
  
  console.log("-".repeat(80));
  console.log();
}

/**
 * Save subtasks to separate files for tracking
 */
function saveSubtasksToFiles(subtasks: Subtask[]): void {
  const subtasksDir = path.join(process.cwd(), ".tasks", "subtasks");
  
  if (!fs.existsSync(subtasksDir)) {
    fs.mkdirSync(subtasksDir, { recursive: true });
  }
  
  subtasks.forEach((subtask) => {
    const filePath = path.join(subtasksDir, `${subtask.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(subtask, null, 2), "utf8");
    console.log(`✓ Saved subtask: ${subtask.id}`);
  });
}

/**
 * Update main task status in store
 */
function updateTaskInStore(task: any, subtasks: Subtask[]): void {
  const store = loadTaskStore();
  
  // Update task status
  task.status = "dispatched";
  task.subtasks = subtasks.map(s => s.id);
  task.execution_strategy.approach = "parallel";
  task.updatedAt = new Date().toISOString();
  
  // Add to store
  store.tasks[task.taskId] = task;
  
  // Save store
  saveTaskToStore(store);
  
  console.log();
  console.log("✓ Updated task in store");
}

/**
 * Monitor subtask execution
 */
async function monitorSubtasks(subtasks: Subtask[]): Promise<void> {
  console.log();
  console.log("MONITORING SUBTASK EXECUTION");
  console.log("-".repeat(80));
  console.log();
  
  const subtasksDir = path.join(process.cwd(), ".tasks", "subtasks");
  let allComplete = false;
  let iterations = 0;
  const maxIterations = 120; // 2 minutes max
  const checkInterval = 1000; // 1 second
  
  while (!allComplete && iterations < maxIterations) {
    // Reload subtasks from files
    let completed = 0;
    let failed = 0;
    let inProgress = 0;
    
    subtasks.forEach((subtask) => {
      const filePath = path.join(subtasksDir, `${subtask.id}.json`);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        const updated: Subtask = JSON.parse(content);
        
        // Update local reference
        subtask.status = updated.status;
        subtask.assignedTo = updated.assignedTo;
        subtask.result = updated.result;
        subtask.error = updated.error;
        subtask.startedAt = updated.startedAt;
        subtask.completedAt = updated.completedAt;
        
        if (updated.status === "completed") completed++;
        else if (updated.status === "failed") failed++;
        else if (updated.status === "in_progress") inProgress++;
      }
    });
    
    // Display progress
    process.stdout.write("\r");
    process.stdout.write(
      `Progress: [${completed}/${subtasks.length}] completed, ` +
      `${inProgress} in progress, ${failed} failed`
    );
    
    // Check if all complete
    if (completed + failed === subtasks.length) {
      allComplete = true;
      process.stdout.write("\n");
      break;
    }
    
    // Wait before next check
    await new Promise(resolve => setTimeout(resolve, checkInterval));
    iterations++;
  }
  
  console.log();
  console.log();
  
  if (!allComplete) {
    console.log("⚠️  Monitoring timeout - some subtasks may still be running");
  } else {
    console.log("✅ All subtasks completed");
  }
  
  console.log();
  console.log("FINAL STATUS:");
  console.log();
  
  subtasks.forEach((subtask) => {
    const statusIcon = subtask.status === "completed" ? "✅" :
                      subtask.status === "failed" ? "❌" :
                      subtask.status === "in_progress" ? "⏳" : "⏸️";
    console.log(`${statusIcon} ${subtask.id}: ${subtask.title}`);
    console.log(`   Status: ${subtask.status}`);
    if (subtask.assignedTo) console.log(`   Assigned to: ${subtask.assignedTo}`);
    if (subtask.error) console.log(`   Error: ${subtask.error.substring(0, 100)}...`);
    console.log();
  });
}

/**
 * Main dispatch function
 */
async function dispatchResearchTask() {
  const taskFile = "task-research-orleans.json";
  
  try {
    // Load task
    const task = loadTask(taskFile);
    
    // Display header
    displayHeader(task);
    
    // Create subtasks
    console.log("Creating parallel subtasks...");
    console.log();
    const subtasks = createSubtasks(task);
    
    // Display subtasks
    displaySubtasks(subtasks);
    
    // Save subtasks to files
    console.log("Saving subtasks to file system...");
    saveSubtasksToFiles(subtasks);
    
    // Update task in store
    console.log();
    console.log("Updating task store...");
    updateTaskInStore(task, subtasks);
    
    // Log dispatch
    await logger.log("info", "Research task dispatched with parallel strategy", {
      taskId: task.taskId,
      subtaskCount: subtasks.length,
      strategy: "parallel",
      targetPath: task.targetPath,
    });
    
    console.log();
    console.log("=".repeat(80));
    console.log("DISPATCH COMPLETE");
    console.log("=".repeat(80));
    console.log();
    console.log("✓ Task successfully dispatched to swarm");
    console.log("✓ 5 parallel subtasks created and tracked");
    console.log("✓ Task store updated");
    console.log();
    console.log("Next Steps:");
    console.log("  1. Subtasks are ready for parallel execution by swarm agents");
    console.log("  2. Each subtask will research one aspect of Orleans framework");
    console.log("  3. Final synthesis will combine all findings");
    console.log("  4. Results will be saved to:", task.targetPath);
    console.log();
    console.log("Monitor execution with:");
    console.log("  cat .tasks/subtasks/*.json");
    console.log();
    
    // Monitor subtasks for demonstration
    console.log("Starting monitoring (press Ctrl+C to stop)...");
    await monitorSubtasks(subtasks);
    
    console.log("=".repeat(80));
    
    process.exit(0);
  } catch (error) {
    console.error();
    console.error("=".repeat(80));
    console.error("DISPATCH ERROR");
    console.error("=".repeat(80));
    console.error();
    console.error(error);
    
    await logger.log("error", "Task dispatch failed", {
      error: error instanceof Error ? error.message : String(error),
      taskFile,
    });
    
    process.exit(1);
  }
}

// Run dispatch
dispatchResearchTask().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
