export interface NewTaskData {
  description: string;
  completed: boolean;
  deadline?: Date;
  created_at: Date;
}

export class NewTask {
  public constructor(public data: NewTaskData) { }

  is_overdue(): boolean | undefined {
    if (!this.data.deadline) {
      return undefined;
    }

    return this.data.deadline < new Date();
  }

}

export interface TaskData extends NewTaskData {
  id: number;
}

export class Task extends NewTask {
  public constructor(public data: TaskData) {
    super(data);
  }
}

