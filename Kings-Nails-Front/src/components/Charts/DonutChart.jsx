import { ResponsivePie } from '@nivo/pie';
import PropTypes from 'prop-types';

const DEFAULT_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#8b5cf6'];

const DonutChart = ({ data = [], size = 200, innerRadius = 0.6, colors = DEFAULT_COLORS }) => {
  // Nivo expects data: [{ id, label, value }]
  const items = (data || []).map(d => ({ id: d.id ?? d.label, label: d.label ?? d.id, value: Number(d.value || 0) }));
  // if items ids are numeric 1..5, map to star colors
  const starIds = items.every(it => ['1','2','3','4','5'].includes(String(it.id)));
  const starColorMap = id => {
    const n = Number(id);
    if (n <= 2) return '#ef4444';
    if (n === 3) return '#f59e0b';
    return '#10b981';
  };
  const resolvedColors = starIds ? items.map(it => starColorMap(it.id)) : colors;

  return (
    <div style={{ width: '100%', height: size }}>
      <ResponsivePie
        data={items}
        margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
        innerRadius={innerRadius}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={resolvedColors}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        tooltip={({ datum: { id, value } }) => (
          <div style={{ padding: 8, background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
            <strong>{id}</strong>: {value}
          </div>
        )}
      />
    </div>
  );
};

DonutChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.any, label: PropTypes.string, value: PropTypes.number })),
  size: PropTypes.number,
  innerRadius: PropTypes.number,
  colors: PropTypes.arrayOf(PropTypes.string),
};

export default DonutChart;
