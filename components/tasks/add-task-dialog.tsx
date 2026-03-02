'use client';

import React, { useState, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    TASK_PRIORITY_CONFIG,
    TASK_STATUS_CONFIG,
    TASK_CATEGORY_CONFIG,
} from '@/lib/constants';
import type { Task, TaskPriority, TaskStatus, TaskCategory } from '@/lib/types';
import { CheckSquare, Loader2 } from 'lucide-react';

interface AddTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingTask?: Task | null;
    onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => void;
}

const INITIAL_FORM = {
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    status: 'todo' as TaskStatus,
    category: 'internal' as TaskCategory,
    assignee: 'You',
    dueDate: '',
};

function formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function AddTaskDialog({
    open,
    onOpenChange,
    editingTask,
    onSave,
}: AddTaskDialogProps) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    // Sync form when editing task changes
    React.useEffect(() => {
        if (editingTask) {
            setForm({
                title: editingTask.title,
                description: editingTask.description,
                priority: editingTask.priority,
                status: editingTask.status,
                category: editingTask.category,
                assignee: editingTask.assignee,
                dueDate: formatDateForInput(editingTask.dueDate),
            });
        } else {
            setForm({
                ...INITIAL_FORM,
                dueDate: formatDateForInput(
                    new Date(Date.now() + 3 * 86400000)
                ),
            });
        }
        setErrors({});
    }, [editingTask, open]);

    const updateField = useCallback(
        (field: string, value: string) => {
            setForm((prev) => ({ ...prev, [field]: value }));
            if (errors[field]) {
                setErrors((prev) => {
                    const next = { ...prev };
                    delete next[field];
                    return next;
                });
            }
        },
        [errors]
    );

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!form.title.trim()) newErrors.title = 'Title is required';
        if (!form.dueDate) newErrors.dueDate = 'Due date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 300));

        onSave({
            title: form.title.trim(),
            description: form.description.trim(),
            priority: form.priority,
            status: form.status,
            category: form.category,
            assignee: form.assignee.trim() || 'You',
            dueDate: new Date(form.dueDate),
        });

        setSaving(false);
        onOpenChange(false);
        setForm(INITIAL_FORM);
    };

    const isEditing = !!editingTask;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        <div className="w-8 h-8 rounded-lg bg-[#730404]/20 flex items-center justify-center">
                            <CheckSquare className="w-4 h-4 text-[#dc2626]" />
                        </div>
                        {isEditing ? 'Edit Task' : 'Add New Task'}
                    </DialogTitle>
                    <DialogDescription className="text-[#666]">
                        {isEditing
                            ? 'Update the task details below.'
                            : 'Fill in the details to create a new task.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="task-title"
                            className="text-[#a3a3a3] text-xs uppercase tracking-wider"
                        >
                            Title <span className="text-[#EF4444]">*</span>
                        </Label>
                        <Input
                            id="task-title"
                            placeholder="Follow up with client..."
                            value={form.title}
                            onChange={(e) => updateField('title', e.target.value)}
                            className={`bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] ${errors.title ? 'border-[#EF4444]' : ''
                                }`}
                        />
                        {errors.title && (
                            <p className="text-[#EF4444] text-xs">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="task-description"
                            className="text-[#a3a3a3] text-xs uppercase tracking-wider"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="task-description"
                            placeholder="Add details about this task..."
                            value={form.description}
                            onChange={(e) => updateField('description', e.target.value)}
                            rows={3}
                            className="bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] resize-none"
                        />
                    </div>

                    {/* Priority + Status row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Priority
                            </Label>
                            <Select
                                value={form.priority}
                                onValueChange={(val) => updateField('priority', val)}
                            >
                                <SelectTrigger
                                    id="task-form-priority"
                                    className="bg-[#0a0a0a] border-[#222] text-white focus:ring-[#730404]"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111] border-[#222]">
                                    {(
                                        Object.entries(TASK_PRIORITY_CONFIG) as [
                                            TaskPriority,
                                            (typeof TASK_PRIORITY_CONFIG)[keyof typeof TASK_PRIORITY_CONFIG]
                                        ][]
                                    ).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: config.color }}
                                                />
                                                {config.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Status
                            </Label>
                            <Select
                                value={form.status}
                                onValueChange={(val) => updateField('status', val)}
                            >
                                <SelectTrigger
                                    id="task-form-status"
                                    className="bg-[#0a0a0a] border-[#222] text-white focus:ring-[#730404]"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111] border-[#222]">
                                    {(
                                        Object.entries(TASK_STATUS_CONFIG) as [
                                            TaskStatus,
                                            (typeof TASK_STATUS_CONFIG)[keyof typeof TASK_STATUS_CONFIG]
                                        ][]
                                    ).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: config.color }}
                                                />
                                                {config.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Category + Assignee row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Category
                            </Label>
                            <Select
                                value={form.category}
                                onValueChange={(val) => updateField('category', val)}
                            >
                                <SelectTrigger
                                    id="task-form-category"
                                    className="bg-[#0a0a0a] border-[#222] text-white focus:ring-[#730404]"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111] border-[#222]">
                                    {(
                                        Object.entries(TASK_CATEGORY_CONFIG) as [
                                            TaskCategory,
                                            (typeof TASK_CATEGORY_CONFIG)[keyof typeof TASK_CATEGORY_CONFIG]
                                        ][]
                                    ).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: config.color }}
                                                />
                                                {config.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="task-assignee"
                                className="text-[#a3a3a3] text-xs uppercase tracking-wider"
                            >
                                Assignee
                            </Label>
                            <Input
                                id="task-assignee"
                                placeholder="You"
                                value={form.assignee}
                                onChange={(e) => updateField('assignee', e.target.value)}
                                className="bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404]"
                            />
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="task-due-date"
                            className="text-[#a3a3a3] text-xs uppercase tracking-wider"
                        >
                            Due Date <span className="text-[#EF4444]">*</span>
                        </Label>
                        <Input
                            id="task-due-date"
                            type="date"
                            value={form.dueDate}
                            onChange={(e) => updateField('dueDate', e.target.value)}
                            className={`bg-[#0a0a0a] border-[#222] text-white focus-visible:ring-[#730404] [color-scheme:dark] ${errors.dueDate ? 'border-[#EF4444]' : ''
                                }`}
                        />
                        {errors.dueDate && (
                            <p className="text-[#EF4444] text-xs">{errors.dueDate}</p>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        id="task-dialog-cancel"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-[#a3a3a3] hover:text-white hover:bg-[#222]"
                    >
                        Cancel
                    </Button>
                    <Button
                        id="task-dialog-save"
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#730404] text-white hover:bg-[#8b1a1a] transition-colors duration-200"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : isEditing ? (
                            'Update Task'
                        ) : (
                            'Add Task'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
