import AppModelType from "../@types/AppModelType";
import SetupConfigType from "../@types/SetupConfigType";

type AppViewProps = {
  appState: AppModelType,
  handleConnectionActive: (value: boolean) => void,
  handleSetup: (setupConfig: SetupConfigType) => void,
  handleLayout: (newLayout: string) => void
}

export default AppViewProps;