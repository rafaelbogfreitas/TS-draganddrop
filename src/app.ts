class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    this.templateEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    const importNode = document.importNode(this.templateEl.content, true);
    this.element = importNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input'
    this.attach();
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element);
  }
}

const projInput = new ProjectInput();
