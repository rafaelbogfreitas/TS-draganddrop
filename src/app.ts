// import { v4 as uuidv4 } from "uuid";

// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(config: Validatable): boolean {
  let isValid = true;
  if (config.required) {
    isValid = isValid && config.value.toString().trim().length > 0;
  }
  if (config.minLength != null && typeof config.value === "string") {
    isValid = isValid && config.value.length > config.minLength;
  }
  if (config.maxLength != null && typeof config.value === "string") {
    isValid = isValid && config.value.length < config.maxLength;
  }
  if (config.min != null && typeof config.value === "number") {
    isValid = isValid && config.value > config.min;
  }
  if (config.max != null && typeof config.value === "number") {
    isValid = isValid && config.value > config.max;
  }
  return isValid;
}

// Autobind decorator

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}
// Project class

enum ProjectStatus {
  Active,
  Inactive,
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
// Project state management

type Listener = (items: Project[]) => void;
class ProjectState {
  private listeners: Array<Listener> = [];
  private projects: Array<Project> = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(newProject);

    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// Component class

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateEl = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById(hostElementId)! as T;

    const importNode = document.importNode(this.templateEl.content, true);
    this.element = importNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtBeggining: boolean) {
    this.hostEl.insertAdjacentElement(
      insertAtBeggining ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;

}

// Project list class

class ProjectList extends Component<HTMLDivElement, HTMLElement>{
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
   this.assignedProjects = [];
   
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Inactive;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });

    this.renderContent();
  }

  private renderProjects() {
    const listId = `${this.type}-project-list`;
    const list = this.element.querySelector(`#${listId}`)! as HTMLUListElement;
    list.innerHTML = "";

    for (const project of this.assignedProjects) {
      const li = document.createElement("li");
      li.textContent = project.title;
      list.appendChild(li);
    }
  }

  configure() {

  }

  renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }
}

// Project input class
class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;

  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    const importNode = document.importNode(this.templateEl.content, true);
    this.element = importNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.configure();
    this.attach();

    this.titleInputEl = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputEl = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputEl = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
  }

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleInputEl.value;
    const description = this.descriptionInputEl.value;
    const people = this.peopleInputEl.value;

    const inputValues: [string, string, number] = [title, description, +people];

    if (
      !validate({value: title, required: true}) ||
      !validate({value: description, required: true, minLength: 5}) ||
      !validate({value: +people, required: true, min: 1})
    ) {
      alert("Invalid inputs");
      return;
    }

    return inputValues;
  }

  @autobind
  private submitHandler(e: Event) {
    e.preventDefault();

    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }

  private clearInputs() {
    this.titleInputEl.value = "";
    this.descriptionInputEl.value = "";
    this.peopleInputEl.value = "";
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element);
  }
}

new ProjectInput();
new ProjectList("active");
new ProjectList("finished");
