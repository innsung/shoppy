import {describe,it,expect,vi,beforeEach,afterEach} from 'vitest';
import {render,screen,fireEvent,waitFor,cleanup,within} from '@testing-library/react';
import {MemoryRouter,useLocation} from 'react-router-dom';
import Products from '../pages/Products.jsx';
import Recommendations from '../../components/recommendations/Recommendations.jsx';
import Header from '../../components/commons/Header.jsx';
import Favorites from '../pages/Favorites.jsx';
import {useFavoriteStore} from '../../store/favoriteStore.js';

const mocks=vi.hoisted(()=>({getProducts:vi.fn(),get:vi.fn(),post:vi.fn(),put:vi.fn(),remove:vi.fn()}));
vi.mock('../../utils/dataFetch.js',()=>({axiosGet:mocks.getProducts,axiosPost:vi.fn()}));
vi.mock('../../utils/recommendationApi.js',()=>({recommendationApi:{get:mocks.get,post:mocks.post,put:mocks.put,delete:mocks.remove}}));
function Location(){const l=useLocation();return <output data-testid="location">{l.pathname+l.search}</output>;}
const products=[{pid:1,name:'분홍 후드티',category:'상의',styles:['캐주얼'],colors:['분홍'],price:15000,image:'/one.webp'}, {pid:2,name:'흰색 가방',category:'가방',styles:['미니멀'],colors:['흰색'],price:20000,image:'/two.webp'}];
let saved;
beforeEach(()=>{
  vi.clearAllMocks();saved={};useFavoriteStore.setState({count:0,revision:0});mocks.getProducts.mockResolvedValue(products);
  mocks.get.mockImplementation(async path=>path==='/favorites'?{data:{items:products.filter(p=>saved[p.pid]==='like')}}:path==='/profile'?{data:{preferences:{styles:['캐주얼'],colors:[],budget:50000},feedback:{...saved},styles:['캐주얼','미니멀'],colors:['분홍','흰색']}}:{data:{items:products.filter(p=>saved[p.pid]!=='dislike').map(p=>({...p,reasons:['예산 이내'],feedback:saved[p.pid]||null})),qualifiedCount:2,totalProducts:2}});
  mocks.post.mockImplementation(async(path,{pid,action})=>{if(action==='clear')delete saved[pid];else saved[pid]=action;return {data:{ok:true}};});
});
afterEach(cleanup);
describe('Shopping regressions',()=>{
  it('filters immediately while preserving Korean input and restores all products when cleared',async()=>{
    render(<MemoryRouter initialEntries={['/products']}><Products/><Location/></MemoryRouter>);
    await screen.findByRole('heading',{name:'전체 상품 2'});
    const input=screen.getByRole('searchbox',{name:'상품 검색'});
    fireEvent.compositionStart(input);
    for(const text of ['ㅎ','후','후ㄷ','후드','후드ㅌ','후드티']){
      fireEvent.change(input,{target:{value:text}});
      expect(input.value).toBe(text);expect(screen.getByTestId('location').textContent).toBe('/products');
    }
    fireEvent.keyDown(input,{key:'Enter',keyCode:229,isComposing:true});
    fireEvent.submit(screen.getByRole('search'));expect(screen.getByTestId('location').textContent).toBe('/products');
    fireEvent.compositionEnd(input,{data:'후드티'});fireEvent.submit(screen.getByRole('search'));
    await waitFor(()=>expect(decodeURIComponent(screen.getByTestId('location').textContent)).toBe('/products?q=후드티'));
    expect(input.value).toBe('후드티');expect(screen.getAllByRole('article')).toHaveLength(1);
    fireEvent.change(input,{target:{value:''}});expect(screen.getAllByRole('article')).toHaveLength(2);
    fireEvent.change(input,{target:{value:'가방'}});expect(screen.getAllByRole('article')).toHaveLength(1);expect(screen.getByRole('img').getAttribute('alt')).toBe('흰색 가방');
  });
  it('updates the header badge for likes, cancellations and dislike without moving recommendations',async()=>{
    render(<MemoryRouter><Header/><Recommendations/></MemoryRouter>);
    await screen.findByRole('heading',{name:'당신을 위한 추천 2'});
    expect(screen.getByRole('link',{name:'좋아요한 상품 0개'}).querySelector('b')).toBeNull();
    fireEvent.click(within(screen.getAllByRole('article')[0]).getByRole('button',{name:'♡ 좋아요'}));
    await screen.findByRole('link',{name:'좋아요한 상품 1개'});
    fireEvent.click(within(screen.getAllByRole('article')[0]).getByRole('button',{name:'♥ 좋아요 취소'}));
    await waitFor(()=>expect(screen.getByRole('link',{name:'좋아요한 상품 0개'}).querySelector('b')).toBeNull());
    fireEvent.click(within(screen.getAllByRole('article')[0]).getByRole('button',{name:'♡ 좋아요'}));
    await screen.findByRole('link',{name:'좋아요한 상품 1개'});
    fireEvent.click(within(screen.getAllByRole('article')[0]).getByRole('button',{name:'관심 없음'}));
    await waitFor(()=>expect(screen.getByRole('link',{name:'좋아요한 상품 0개'}).querySelector('b')).toBeNull());
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
  it('loads saved badge count and clears it when removing a favorite in the collection',async()=>{
    saved[1]='like';render(<MemoryRouter><Header/><Favorites/></MemoryRouter>);
    await screen.findByRole('link',{name:'좋아요한 상품 1개'});
    fireEvent.click(await screen.findByRole('button',{name:'좋아요 취소'}));
    await waitFor(()=>expect(screen.getByRole('link',{name:'좋아요한 상품 0개'}).querySelector('b')).toBeNull());
    expect(saved[1]).toBeUndefined();
  });
  it('saves like/dislike without refreshing or reordering current recommendations; remount applies saved feedback',async()=>{
    const view=render(<MemoryRouter><Recommendations/></MemoryRouter>);
    await screen.findByRole('heading',{name:'당신을 위한 추천 2'});
    const originalNames=screen.getAllByRole('article').map(p=>within(p).getByRole('img').getAttribute('alt'));
    const getCount=mocks.get.mock.calls.length;
    fireEvent.click(within(screen.getAllByRole('article')[0]).getByRole('button',{name:'♡ 좋아요'}));
    await screen.findByRole('button',{name:'♥ 좋아요 취소'});
    expect(saved[1]).toBe('like');expect(mocks.get).toHaveBeenCalledTimes(getCount);
    fireEvent.click(within(screen.getAllByRole('article')[1]).getByRole('button',{name:'관심 없음'}));
    await screen.findByRole('button',{name:'관심 없음 취소'});
    expect(saved[2]).toBe('dislike');expect(mocks.get).toHaveBeenCalledTimes(getCount);
    expect(screen.getAllByRole('article').map(p=>within(p).getByRole('img').getAttribute('alt'))).toEqual(originalNames);
    view.unmount();render(<MemoryRouter><Recommendations/></MemoryRouter>);
    await screen.findByRole('heading',{name:'당신을 위한 추천 1'});expect(screen.getAllByRole('article')).toHaveLength(1);
  });
  it('keeps current results when saving feedback fails',async()=>{
    mocks.post.mockRejectedValueOnce(new Error('offline'));
    render(<MemoryRouter><Recommendations/></MemoryRouter>);await screen.findByRole('heading',{name:'당신을 위한 추천 2'});
    fireEvent.click(within(screen.getAllByRole('article')[0]).getByRole('button',{name:'♡ 좋아요'}));
    await screen.findByRole('alert');expect(screen.getAllByRole('article')).toHaveLength(2);expect(saved).toEqual({});
  });
});
