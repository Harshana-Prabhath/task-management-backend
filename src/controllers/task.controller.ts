import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Task, TaskPriority, TaskStatus } from "../models/Task.entity";
import { User, UserRole } from "../models/User.entity";
import { AppError } from "../utils/appError";
import { sendSuccess } from "../utils/successResponse";
import { Like } from "typeorm";

const taskRepository = AppDataSource.getRepository(Task);
const userRepository = AppDataSource.getRepository(User);

// create task function
export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, priority, status, dueDate, assignedToId } = req.body;
    const creatorId = req.user!.userId;

    
    const creator = await userRepository.findOne({ where: { id: creatorId } });
    if (!creator) return next(new AppError("Creator profile not found.", 404));

    
    let assignedTo: User | null = null;
    if (assignedToId) {
      assignedTo = await userRepository.findOne({ where: { id: assignedToId as string } });
      if (!assignedTo) return next(new AppError("Assigned user not found.", 404));
    }

    const newTask = taskRepository.create({
      title,
      description,
      priority: priority || TaskPriority.MEDIUM,
      status: status || TaskStatus.OPEN,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdBy: creator,
      assignedTo,
    });

    await taskRepository.save(newTask);
    return sendSuccess(res, newTask, "Task created successfully!", 201);
  } catch (error) {
    next(error);
  }
};

// function to get all tasks
export const getAllTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, role } = req.user!;
    const search = typeof req.query.search === "string" ? req.query.search : "";
    const priority = typeof req.query.priority === "string" ? req.query.priority : undefined;
    const status = typeof req.query.status === "string" ? req.query.status : undefined;

    
    const queryConditions: any = {};

     
    if (role !== UserRole.ADMIN) {
      queryConditions.where = [
        { createdBy: { id: userId } },
        { assignedTo: { id: userId } }
      ];
    } else {
      queryConditions.where = {};
    }

   
    if (search) {
      const searchPattern = Like(`%${search}%`);
      if (Array.isArray(queryConditions.where)) {
        queryConditions.where = queryConditions.where.map((cond: any) => ({ ...cond, title: searchPattern }));
      } else {
        queryConditions.where.title = searchPattern;
      }
    }

    if (priority) {
      if (Array.isArray(queryConditions.where)) {
        queryConditions.where = queryConditions.where.map((cond: any) => ({ ...cond, priority }));
      } else {
        queryConditions.where.priority = priority;
      }
    }

    if (status) {
      if (Array.isArray(queryConditions.where)) {
        queryConditions.where = queryConditions.where.map((cond: any) => ({ ...cond, status }));
      } else {
        queryConditions.where.status = status;
      }
    }

    
    queryConditions.relations = {
      createdBy: true,
      assignedTo: true,
    };
    queryConditions.order = { createdAt: "DESC" };

    const tasks = await taskRepository.find(queryConditions);
    
    
    const sanitizedTasks = tasks.map(task => ({
      ...task,
      createdBy: { id: task.createdBy.id, email: task.createdBy.email },
      assignedTo: task.assignedTo ? { id: task.assignedTo.id, email: task.assignedTo.email } : null,
    }));

    return sendSuccess(res, sanitizedTasks, "Tasks retrieved successfully.");
  } catch (error) {
    next(error);
  }
};

//function to get task by id
export const getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id as string);
    const { userId, role } = req.user!;

    const task = await taskRepository.findOne({
      where: { id: taskId },
      relations: {
        createdBy: true,
        assignedTo: true,
      },
    });

    if (!task) return next(new AppError("Task not found.", 404));

    
    if (role !== UserRole.ADMIN && task.createdBy.id !== userId && task.assignedTo?.id !== userId) {
      return next(new AppError("You are not authorized to view this task.", 403));
    }

    const sanitizedTask = {
      ...task,
      createdBy: { id: task.createdBy.id, email: task.createdBy.email },
      assignedTo: task.assignedTo ? { id: task.assignedTo.id, email: task.assignedTo.email } : null,
    };

    return sendSuccess(res, sanitizedTask, "Task details fetched successfully.");
  } catch (error) {
    next(error);
  }
};

//function to update task
export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id as string);
    const { userId, role } = req.user!;
    const { title, description, priority, status, dueDate, assignedToId } = req.body;

    const task = await taskRepository.findOne({
      where: { id: taskId },
      relations: {
        createdBy: true,
        assignedTo: true,
      },
    });

    if (!task) return next(new AppError("Task not found.", 404));

   
    if (role !== UserRole.ADMIN && task.createdBy.id !== userId && task.assignedTo?.id !== userId) {
      return next(new AppError("You are not authorized to edit this task.", 403));
    }

    
    if (assignedToId !== undefined) {
      if (assignedToId === null) {
        task.assignedTo = null;
      } else {
        const checkAssignee = await userRepository.findOne({ where: { id: assignedToId as string } });
        if (!checkAssignee) return next(new AppError("New assignee user not found.", 404));
        task.assignedTo = checkAssignee;
      }
    }

    
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (dueDate) task.dueDate = new Date(dueDate);

    await taskRepository.save(task);
    return sendSuccess(res, task, "Task updated successfully.");
  } catch (error) {
    next(error);
  }
};

//function to delete task
export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id as string);
    const { userId, role } = req.user!;

    const task = await taskRepository.findOne({
      where: { id: taskId },
      relations: {
        createdBy: true,
      },
    });

    if (!task) return next(new AppError("Task not found.", 404));

    if (role !== UserRole.ADMIN && task.createdBy.id !== userId) {
      return next(new AppError("Access denied. Only the task author or an Admin can delete this task.", 403));
    }

    await taskRepository.remove(task);
    return sendSuccess(res, null, "Task deleted permanently.");
  } catch (error) {
    next(error);
  }
};