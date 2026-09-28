import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import pool from '../db/connection.js';

// Curated labels for publicly available DummyJSON demonstration products.
const samples=[
 [83,'블루 블랙 체크 셔츠','상의',['캐주얼','클래식'],['파랑','검정'],29000],
 [84,'그래픽 티셔츠','상의',['캐주얼','스포티'],[],19000],
 [85,'데일리 플래드 셔츠','상의',['캐주얼','클래식'],[],32000],
 [86,'라이트 반소매 셔츠','상의',['캐주얼','미니멀'],[],27000],
 [87,'클래식 체크 셔츠','상의',['클래식','캐주얼'],[],35000],
 [177,'블랙 이브닝 드레스','원피스',['페미닌','클래식'],['검정'],89000],
 [178,'코르셋 레더 스커트 세트','셋업',['페미닌'],[],69000],
 [179,'블랙 스커트 코르셋 세트','셋업',['페미닌','클래식'],['검정'],59000],
 [180,'패턴 데일리 드레스','원피스',['페미닌','캐주얼'],[],39000],
 [181,'레드 블랙 수트 세트','셋업',['클래식'],['빨강','검정'],99000],
 [162,'블루 플레어 원피스','원피스',['페미닌'],['파랑'],45000],
 [163,'서머 패턴 원피스','원피스',['페미닌','캐주얼'],[],29000],
 [164,'그레이 데일리 원피스','원피스',['미니멀','페미닌'],['회색'],49000],
 [165,'쇼트 플레어 원피스','원피스',['페미닌','캐주얼'],[],35000],
 [166,'타탄 체크 원피스','원피스',['클래식','페미닌'],[],55000],
 [172,'블루 데일리 핸드백','가방',['캐주얼','미니멀'],['파랑'],39000],
 [175,'화이트 레더 백팩','가방',['캐주얼','미니멀'],['흰색'],45000],
 [176,'블랙 클래식 핸드백','가방',['클래식','미니멀'],['검정'],59000],
 [185,'블랙 브라운 슬리퍼','신발',['캐주얼','미니멀'],['검정','갈색'],19000],
 [188,'데일리 펌프스','신발',['페미닌','클래식'],[],49000],
 [189,'레드 포인트 슈즈','신발',['페미닌'],['빨강'],39000],
];
const target=new URL('../../front/public/images/catalog/',import.meta.url);
await fs.mkdir(target,{recursive:true});
const manifest=[];
try {
  const [products]=await pool.query('SELECT * FROM product');
  const [details]=await pool.query('SELECT * FROM product_detailinfo');
  const [tags]=await pool.query('SELECT * FROM recommendation_tags');
  await fs.mkdir('./.cache',{recursive:true});
  await fs.writeFile(`./.cache/catalog-before-refresh-${Date.now()}.json`,JSON.stringify({products,details,tags},null,2));
  for(const [id,name,category,styles,colors,price] of samples){
    const r=await fetch(`https://dummyjson.com/products/${id}`);if(!r.ok)throw new Error(`Product download failed: ${id}`);
    const source=await r.json();
    const url=source.images?.[0]||source.thumbnail;
    if(new URL(url).hostname!=='cdn.dummyjson.com')throw new Error('Unexpected asset host');
    const image=await fetch(url);if(!image.ok||!image.headers.get('content-type')?.startsWith('image/'))throw new Error(`Image download failed: ${id}`);
    const bytes=Buffer.from(await image.arrayBuffer());
    const filename=`dummyjson-${id}.webp`;
    await fs.writeFile(new URL(filename,target),bytes);
    manifest.push({id,name,category,styles,colors,price,image:`catalog/${filename}`,source:url,sourceTitle:source.title,sourceDescription:source.description,sha256:createHash('sha256').update(bytes).digest('hex')});
  }
  if(new Set(manifest.map(p=>p.sha256)).size!==21)throw new Error('Duplicate catalog images');
  const [targets]=await pool.query('SELECT pid FROM recommendation_tags WHERE sample_key IS NOT NULL ORDER BY pid');
  if(targets.length!==21)throw new Error('Expected exactly 21 demonstration products');
  const conn=await pool.getConnection();
  try{
    await conn.beginTransaction();
    for(let i=0;i<manifest.length;i++){
      const p=manifest[i],pid=targets[i].pid;
      const description=`${p.styles.join(' ')} 스타일의 ${p.colors.join(' ')} ${p.name}. ${p.sourceDescription}`;
      await conn.execute('UPDATE product SET name=?,price=?,info=?,image=?,img_list=? WHERE pid=?',[`${p.name} · 샘플`,String(p.price),'시연용 상품 · 샘플 가격',p.image,JSON.stringify([`/images/${p.image}`]),pid]);
      await conn.execute('UPDATE recommendation_tags SET styles=?,colors=?,category=?,season=?,description=? WHERE pid=?',[JSON.stringify(p.styles),JSON.stringify(p.colors),p.category,'',description,pid]);
      await conn.execute('UPDATE product_detailinfo SET title_en=?,title_ko=?,list=? WHERE pid=?',[p.sourceTitle,p.name,JSON.stringify([{title:'상품 안내',description:[`${p.name} / ${p.category}`,`스타일: ${p.styles.join(', ')}`,p.colors.length?`색상: ${p.colors.join(', ')}`:'색상은 상품 이미지를 참고해주세요.','DummyJSON 공개 상품 데이터를 사용한 시연용 상품입니다. 가격은 샘플이며 실제 판매 정보가 아닙니다.']}]),pid]);
      p.pid=pid;
    }
    // Existing guest likes refer to the old sample products; remove only those entries.
    for(let i=0;i<targets.length;i++){
      const {pid}=targets[i];
      if(products.find(p=>p.pid===pid)?.name!==`${manifest[i].name} · 샘플`)await conn.execute('UPDATE recommendation_profiles SET feedback=JSON_REMOVE(feedback,?)',[`$."${pid}"`]);
    }
    await conn.commit();
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
  await fs.writeFile(new URL('sources.json',target),JSON.stringify({provider:'DummyJSON',documentation:'https://dummyjson.com/docs/products',note:'Public demonstration catalog. Prices and Korean style labels are local demo annotations.',products:manifest},null,2));
  console.log('Updated 21 samples with 21 distinct product photographs and matching product metadata. Original 7 products retained.');
}finally{await pool.end();}
