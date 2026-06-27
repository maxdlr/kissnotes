import Tabs from "../Tabs";
import ProfileSettings from "./components/ProfileSettings";
import SavesList from "./components/SavesList";

const UserSettings = () => {
  return (
    <Tabs.Container defaultTab="profile">
      <Tabs.Tab label="Profile" value="profile">
        <ProfileSettings />
      </Tabs.Tab>

      <Tabs.Tab label="Saves" value="saves">
        <SavesList />
      </Tabs.Tab>
    </Tabs.Container>
  );
};
export default UserSettings;
