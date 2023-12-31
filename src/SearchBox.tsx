import './assets/search.css'
import searchImg from './assets/search.png'
export default function (opt:{search:(m?:boolean)=>void,setQueryType:(t:number)=>void,setQueryKeywords:(s:string)=>void}) {
    const {search,setQueryKeywords,setQueryType} = opt
    const ar = [
        {
            title: '单曲',
            value: 1,
        },
        {
            title: 'MV',
            value: 1004,
        }
    ]
  
    const onChange = (s:string)=>{
        setQueryKeywords(s)
    }

    return <div className="search-box">
        <div>
            <select onChange={(e)=>{setQueryType(Number(e.target.value))}}>
                {ar.map(t=><option value={t.value} key={t.value}>{t.title}</option>)}
            </select>
            <input type="text" placeholder="输入关键词搜索" onInput={(e:any)=>onChange(String(e.target.value).trim())} inputMode="search" autoComplete="off" onKeyDown={(e)=>e.key=='Enter'?search(false):null}/>
            <img src={searchImg} alt="search" onClick={()=>search(false)}/>
        </div>
    </div>
}