import { useEffect, useState } from 'react'

import './App.css'
import SearchBox from './SearchBox'
import Musics from './Musics'
import Controller from './Controller'
import MusicApi from './service/music'
import Loading from './componments/Loading'
import Notice from './componments/Notice'
import { SEARCH_TYPE } from './utils/com'

function App() {
  const [musics, setMusics] = useState(Array<MusicMvMeta>)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState({ txt: '', show: false })
  const [mvCount, setmvCount] = useState(0)

  const [query, setQuery] = useState({
    keywords: '老歌',
    type: SEARCH_TYPE.Single,
    limit: 30,
    offset: 1
  })
  let closeNoticeTimer: any;
  const showNotice = (txt: string) => {
    clearTimeout(closeNoticeTimer)
    setNotice({
      txt: txt,
      show: true
    })
    closeNoticeTimer = setTimeout(() => {
      setNotice({
        txt: '',
        show: false
      })
    }, 1500)
  }
  // 首次搜索
  let init = false
  useEffect(()=>{
    if(init){
      return
    }
    search(false)
    init = true
  },[query])
  const search = async (more?: boolean) => {
    if(query.keywords.length == 0){
      showNotice('请输入关键字')
      return
    }
    if (more) {
      query.offset++
    } else {
      query.offset = 1
      setmvCount(0)
      setMusics([])
    }

    setQuery(query)
    setLoading(true)
    const res = await MusicApi.search(query).catch(() => {
      showNotice('搜索失败，请稍后再试')
    })
    setLoading(false)
    if (!res) {
      return
    }
    let mvs = []
    if (query.type == SEARCH_TYPE.Single) {
      setmvCount(Number(res.data.result.songCount))
      mvs = res && res.data.result.songs ? res.data.result.songs : []
    } else {
      setmvCount(Number(res.data.result.mvCount))
      mvs = res && res.data.result.mvs ? res.data.result.mvs : []
    }

    if (more) {

      setMusics(musics.concat(mvs))
    } else {
      setMusics(mvs)
    }
  }
  const setQueryKeywords = (s: string) => {
    query.keywords = s
    setQuery(query)

  }
  const setQueryType = (t: number) => {
    query.type = t;
    setQuery(query)
  }
  return (
    <div className='warp'>
      <Notice txt={notice.txt} show={notice.show} />
      <Loading loading={loading} />
      <SearchBox search={search} setQueryKeywords={setQueryKeywords} setQueryType={setQueryType}/>
      <Musics mType={query.type} mvCount={mvCount} musics={musics} setLoading={setLoading} showNotice={showNotice} search={search} />
      <Controller setLoading={setLoading} showNotice={showNotice} />
    </div>
  )
}
export default App
