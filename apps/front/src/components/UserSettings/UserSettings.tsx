import Tabs from "../Tabs";
import ProfileSettings from "./components/ProfileSettings";
import SavesList from "./components/SavesList";

const UserSettings = ({ className = "" }: { className?: string }) => {
  return (
    <div className={className}>
      <Tabs.Container defaultTab="profile">
        <Tabs.Tab label="Profile" value="profile">
          <ProfileSettings />
        </Tabs.Tab>

        <Tabs.Tab label="Saves" value="saves">
          <SavesList />
        </Tabs.Tab>
      </Tabs.Container>
    </div>
  );
};
export default UserSettings;
