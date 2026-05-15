import { useState, useEffect } from 'react';
import { SearchForm } from '@/components/commons/SearchForm.jsx';
import { MenuList } from '@/components/commons/MenuList.jsx';
import Pagination from 'rc-pagination';
import 'bootstrap/dist/css/bootstrap.css';
import 'rc-pagination/assets/index.css';

export default function Support() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [menus, setMenus] = useState([]);
  const [category, setCategory] = useState([]);
  const [allList, setAllList] = useState([]);
  const [list, setList] = useState([]);
  const [stype, setStype] = useState('all');
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [supportRes, listRes] = await Promise.all([
        fetch('/data/support.json').then(r => r.json()),
        fetch('/data/support_list.json').then(r => r.json()),
      ]);
      setMenus(supportRes.menus);
      setCategory(supportRes.category);
      const numbered = listRes.map((item, idx) => ({ ...item, rowNumber: listRes.length - idx }));
      setAllList(numbered);
    };
    fetchData();
  }, []);

  // 필터 + 검색 + 페이징 처리 (JSON 기반)
  useEffect(() => {
    let filtered = allList;
    if (stype !== 'all') filtered = filtered.filter(item => item.type === stype);
    if (searchData?.keyword) {
      const kw = searchData.keyword.toLowerCase();
      filtered = filtered.filter(item => {
        const field = searchData.type === 'title' ? item.title
                    : searchData.type === 'content' ? (item.content ?? '')
                    : (item.rdate ?? '');
        return field.toLowerCase().includes(kw);
      });
    }
    const start = (currentPage - 1) * pageSize;
    setList(filtered.slice(start, start + pageSize));
  }, [allList, stype, searchData, currentPage, pageSize]);

  const filterList = (type) => { setStype(type); setCurrentPage(1); };
  const handleSearch = (data) => { setSearchData(data); setCurrentPage(1); };

  const filteredTotal = (() => {
    let f = allList;
    if (stype !== 'all') f = f.filter(i => i.type === stype);
    if (searchData?.keyword) {
      const kw = searchData.keyword.toLowerCase();
      f = f.filter(i => {
        const field = searchData.type === 'title' ? i.title : searchData.type === 'content' ? (i.content ?? '') : (i.rdate ?? '');
        return field.toLowerCase().includes(kw);
      });
    }
    return f.length;
  })();

  return (
    <div className="content">
      <div className="support center-layout">
        <h1 className="center-title">공지/뉴스</h1>
        <div className="support-content">
          <p style={{ color: '#777' }}>CGV의 주요한 이슈 및 여러가지 소식들을 확인할 수 있습니다.</p>
          <SearchForm category={category} search={handleSearch} />
          <nav><MenuList menus={menus} filterList={filterList} /></nav>
          <p style={{ color: '#777' }}>총 {filteredTotal}건이 검색되었습니다.</p>
          <table>
            <thead>
              <tr><th>번호</th><th>구분</th><th>제목</th><th>등록일</th><th>조회수</th></tr>
            </thead>
            <tbody>
              {list.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.rowNumber}</td>
                  <td>[{item.type}]</td>
                  <td>{item.title}</td>
                  <td>{item.rdate}</td>
                  <td>{item.hits}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5}>
                  <Pagination className="d-flex justify-content-center"
                    current={currentPage} total={filteredTotal} pageSize={pageSize}
                    onChange={page => setCurrentPage(page)} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
