import {create} from 'zustand';
import {recommendationApi} from '@/utils/recommendationApi.js';

export const useFavoriteStore=create((set,get)=>({
  count:0,
  revision:0,
  setCount:count=>set(s=>({count:Math.max(0,Number(count)||0),revision:s.revision+1})),
  refresh:async()=>{
    const revision=get().revision;
    try{
      const {data}=await recommendationApi.get('/favorites');
      // An older initial request must not overwrite a later feedback change.
      if(get().revision===revision)get().setCount(data.items.length);
    }catch{/* Keep the last successfully saved count on network failure. */}
  },
}));
