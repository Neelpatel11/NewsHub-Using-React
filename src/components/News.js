import React , {useEffect  , useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";



const News = (props) => {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

  
  
   const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


   const updateNews = async () => {
        props.setProgress(20);
        const url =`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=e37d6be1448246ad91b4e858f01e15e0&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(50);
        let parsedData = await data.json()
        props.setProgress(70);
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100);
    }
    useEffect(() => {
            document.title = `${capitalizeFirstLetter(props.category)} - NewsHub`;
        updateNews();
    }, [])
   

  const  fetchMoreData = async () => {
          const url =`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=e37d6be1448246ad91b4e858f01e15e0&page=${page+1}&pageSize=${props.pageSize}`;
          setPage(page+1)
        // this.setState({loading : true});
        let data = await fetch(url);
        let parsedData = await data.json()
        console.log(parsedData);
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
      };


        return ( 
            <div className="container my-3">
            <div className="lol">
                <h1 className="text-center" style={{margin: '15px 0px', marginTop : '78px' , color :props.mode=== !'dark'?'red':'#29489B'}}>NewsHub- Top  {capitalizeFirstLetter(props.category)} Headlines </h1>
                </div>
                {loading && <Spinner/>}
                <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
        >
            <div className="container">
            <div className="row">
            {articles.map((element)=>{
              return   <div className="col-md-4"  key={element.url}>
                 <NewsItem title={element.title?element.title:""} description ={element.description?element.description:""}  imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}  />
                 </div>
                 
            })}
                </div>
                </div>
                </InfiniteScroll>
            </div>
        ) 
    
}

News.defaultProps ={
    country : 'in',
    pageSize : 8,
    category : 'general',
}
News.defaultProps ={
    country : PropTypes.string,
    category : PropTypes.string,
    pageSize : PropTypes.number,
}


export default News    