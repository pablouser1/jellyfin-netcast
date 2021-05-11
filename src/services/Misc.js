import requests from "./api";
import profile from '../helpers/DeviceProfile.json'
export default class Misc {
  static sendProfile() {
    requests("/Sessions/Capabilities/Full", "POST", profile)
  }
}
