import toolState from '../store/toolState';
import '../styles/toolbar.css';

const SettingBar = () => {
  return (
    <div
      className="toolbar"
      style={{ top: 45, justifyContent: 'flex-start', gap: 20 }}
    >
      <label className="setting">
        Line width:
        <input
          type="number"
          min={1}
          max={50}
          defaultValue={1}
          onChange={(e) => {
            toolState.setLineWidth(+e.currentTarget.value);
          }}
        />
      </label>
      <label className="setting">
        Stroke color:
        <input
          type="color"
          onChange={(e) => toolState.setStrokeColor(e.currentTarget.value)}
        />
      </label>
    </div>
  );
};

export default SettingBar;
