import IdeasHistoryProps from '../../@types/IdeasHistoryProps';
import IdeasHistoryController from "./controller";

const IdeasHistory = (props: IdeasHistoryProps) => {
  return(
    <IdeasHistoryController
      {...props}
    />
  )
}

export default IdeasHistory;