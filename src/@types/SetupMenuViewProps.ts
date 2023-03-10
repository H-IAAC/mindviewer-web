import SetupMenuModelType from "../@types/SetupMenuModelType";

type SetupMenuViewProps = {
  setupMenuState: SetupMenuModelType,
  handleSelectedOption: (option: number) => void,
  handleStage: (stage: number) => void,
  handleUrlOption: (url: string) => void,
  handleFileOption: (files: FileList | undefined) => Promise<void>
}

export default SetupMenuViewProps;