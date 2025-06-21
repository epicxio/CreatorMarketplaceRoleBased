import { Request, Response } from 'express';
import Role, { IRole } from '../models/Role';

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;
  
  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

export const createRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, permissions } = req.body;
    const role = new Role({
      name,
      description,
      permissions
    });
    await role.save();
    res.status(201).json(role);
  } catch (error: unknown) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const getRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await Role.find({ isActive: true });
    res.json(roles);
  } catch (error: unknown) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const getRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }
    res.json(role);
  } catch (error: unknown) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const updateRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, permissions } = req.body;
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    role.name = name || role.name;
    role.description = description || role.description;
    role.permissions = permissions || role.permissions;

    await role.save();
    res.json(role);
  } catch (error: unknown) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const deleteRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    role.isActive = false;
    await role.save();
    
    res.json({ message: 'Role deleted successfully' });
  } catch (error: unknown) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const addPermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resource, actions } = req.body;
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    role.permissions.push({ resource, actions });
    await role.save();
    
    res.json(role);
  } catch (error: unknown) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const removePermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resource } = req.body;
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    role.permissions = role.permissions.filter(p => p.resource !== resource);
    await role.save();
    
    res.json(role);
  } catch (error: unknown) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
}; 