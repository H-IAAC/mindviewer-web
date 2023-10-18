type IdeasHistoryProps = {
  index: number,
  time: string,
  numberOfElements: number,
  isLoadingFileData: boolean,
  fromFile: boolean,
  currentTime: number,
  indexToDisplay: number,
  handleUserIndex: (customIndex: number) => void
}

export default IdeasHistoryProps;