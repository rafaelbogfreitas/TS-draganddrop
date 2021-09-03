/// <reference path="./models/dragAndDropInterfaces.ts" />
/// <reference path="./state/ProjectState.ts" />
/// <reference path="./decorators/autobind.ts" />
/// <reference path="./decorators/validate.ts" />
/// <reference path="./models/ProjectModel.ts" />
/// <reference path="./state/ProjectState.ts" />
/// <reference path="./components/ProjectInput.ts" />
/// <reference path="./components/ProjectItem.ts" />
/// <reference path="./components/ProjectList.ts" />
namespace App {
  new ProjectInput();
  new ProjectList("active");
  new ProjectList("finished");
}
