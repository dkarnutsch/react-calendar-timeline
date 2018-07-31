import Timeline from './lib/Timeline'
import moment from "moment";
// TODO Remove me if production ready and deployed to npm
import "moment/locale/de";

export {
  default as TimelineMarkers
} from './lib/markers/public/TimelineMarkers'
export { default as TodayMarker } from './lib/markers/public/TodayMarker'
export { default as CustomMarker } from './lib/markers/public/CustomMarker'
export { default as CursorMarker } from './lib/markers/public/CursorMarker'

// TODO Remove me if production ready and deployed to npm
moment.locale("de");

export default Timeline
