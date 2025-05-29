import { _decorator } from "cc";
import Observer from "observer";

import SplashComponentBase from "./splash-component-base";

const { ccclass } = _decorator;
const { observer } = Observer;

@ccclass
@observer
export default class Splash extends SplashComponentBase {}
