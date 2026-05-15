export default function Tabs({ currentTab, onTabChange }) {
  const tabLabels = ['DETAIL', 'REVIEW', 'Q&A', 'RETURN & DELIVERY'];
  const tabEventNames = ['detail', 'review', 'qna', 'return'];

  return (
    <ul className="tabs">
      {tabLabels.map((label, i) => (
        <li className={currentTab === tabEventNames[i] ? 'active' : ''} key={i}>
          <button type="button" onClick={() => onTabChange(tabEventNames[i])}>{label}</button>
        </li>
      ))}
    </ul>
  );
}
