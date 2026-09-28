import pool from '../db/connection.js';
import fs from 'node:fs/promises';

export async function seed() {
  await pool.query(`CREATE TABLE IF NOT EXISTS recommendation_tags (
    pid INT PRIMARY KEY, styles JSON NOT NULL, colors JSON NOT NULL,
    category VARCHAR(30) NOT NULL, season VARCHAR(50) NOT NULL,
    description TEXT NOT NULL, sample_key VARCHAR(80) UNIQUE NULL,
    FOREIGN KEY (pid) REFERENCES product(pid) ON DELETE CASCADE)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS recommendation_profiles (
    id VARCHAR(36) PRIMARY KEY, preferences JSON NOT NULL, feedback JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
  const [originals] = await pool.query('SELECT * FROM product WHERE pid BETWEEN 1 AND 7 ORDER BY pid');
  await fs.mkdir('./.cache', {recursive:true});
  try { await fs.writeFile('./.cache/products-before-recommendations.json', JSON.stringify(originals,null,2), {flag:'wx'}); } catch(e) {if(e.code!=='EEXIST')throw e;}
  const meta = {
    1: [['캐주얼','스포티'],['분홍'],'상의','봄 가을','편안한 캐주얼 분홍색 후드티'],
    2: [['캐주얼','스포티'],['검정'],'상의','봄 가을','편안한 캐주얼 검정색 후드티'],
    3: [['페미닌'],[],'원피스','봄 여름','외출할 때 입는 페미닌 원피스'],
    4: [['캐주얼','스포티'],[],'하의','여름','가볍게 활동할 때 입는 캐주얼 반바지'],
    5: [['미니멀','캐주얼'],[],'상의','봄 여름','일상에 매치하는 미니멀 티셔츠'],
    6: [['페미닌','클래식'],[],'원피스','봄 가을','단정하게 입는 스트레치 비스트 드레스'],
    7: [['클래식','미니멀'],[],'아우터','봄 가을','출근과 외출에 어울리는 단정한 자켓'],
  };
  const conn=await pool.getConnection();
  try {
    await conn.beginTransaction();
    for(const p of originals) {
      const [styles,colors,category,season,description]=meta[p.pid];
      await conn.execute('INSERT IGNORE INTO recommendation_tags (pid,styles,colors,category,season,description) VALUES (?,?,?,?,?,?)',[p.pid,JSON.stringify(styles),JSON.stringify(colors),category,season,description]);
      for(let i=1;i<=3;i++) {
        const key=`demo-v1-${p.pid}-${i}`;
        const [exists]=await conn.execute('SELECT pid FROM recommendation_tags WHERE sample_key=?',[key]);
        if(exists.length)continue;
        const variant=['데일리','위크엔드','시티'][i-1];
        const name=`${variant} ${p.name} · 샘플`;
        const price=Math.round(Number(p.price)*[0.8,1.3,1.6][i-1]/1000)*1000;
        const desc=`${description}. ${variant} 코디를 위한 추천 시연용 가상 상품입니다. 기존 상품 이미지를 재사용하며 가격과 설명은 샘플입니다.`;
        const [insert]=await conn.execute('INSERT INTO product (name,price,info,rate,image,img_list) VALUES (?,?,?,?,?,?)',[name,String(price),'추천 기능 시연용 가상 상품 · 기존 이미지 재사용',0,p.image,JSON.stringify([`/images/${p.image}`])]);
        await conn.execute('INSERT INTO product_detailinfo (title_en,title_ko,pid,list) VALUES (?,?,?,?)',['RECOMMENDATION DEMO',name,insert.insertId,JSON.stringify([{title:'시연용 상품 안내',description:[desc]}])]);
        await conn.execute('INSERT INTO recommendation_tags (pid,styles,colors,category,season,description,sample_key) VALUES (?,?,?,?,?,?,?)',[insert.insertId,JSON.stringify(styles),JSON.stringify(colors),category,season,desc,key]);
      }
    }
    await conn.commit();
  } catch(e) {await conn.rollback();throw e;} finally {conn.release();}
}
if(process.argv[1]?.endsWith('seed.mjs')) {try {await seed();console.log('Recommendation tables and 28-product demo catalog ready.');}finally {await pool.end();}}
