import LineDiscovery from "./components/LineDiscovery";
import StopPointsDiscovery from "./components/StopPointsDiscovery";
import StopMonitoring from "./components/StopMonitoring";
import EstimatedTimetable from "./components/EstimatedTimetable";
import StopMonitoringForm from "./components/StopMonitoringForm";
import EstimatedTimetableForm from "./components/EstimatedTimetableForm"

const routes = [
  {
    path: "/lines-discovery",
    name: "LineDiscovery",
    component: LineDiscovery
  },
  {
    path: "/stop-points-discovery",
    name: "StopPointsDiscovery",
    component: StopPointsDiscovery
  },
  {
    path: "/stop-monitoring",
    name: "StopMonitoring",
    form: StopMonitoringForm,
    component: StopMonitoring
  },
  {
    path: "/estimated-timetable",
    name: "EstimatedTimetable",
    form: EstimatedTimetableForm,
    component: EstimatedTimetable
  },
];

export function findRouteByLocation(location) {
  return routes.find((t) => t.path === location);
}

export default routes;