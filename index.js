import { tweetsData as defaultTweetsData } from './data.js'
let tweetsData = loadFromLocalStorage() || defaultTweetsData
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.replyBtn){
    handleReplyBtnClick(e.target.dataset.replyBtn)
    }
    else if(e.target.dataset.delete){
    handleDeleteClick(e.target.dataset.delete)
    }


})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
    saveToLocalStorage()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
    saveToLocalStorage() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    saveToLocalStorage()
    tweetInput.value = ''
    }

}
function handleReplyBtnClick(tweetId){
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    const replyText = replyInput.value.trim()

    if(replyText){
        const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId)
        targetTweetObj.replies.push({
            handle: "@You",
            profilePic: "/scrimbalogo.png",
            tweetText: replyText
        })
        replyInput.value = ''
        saveToLocalStorage()
        render()
    }
}
function handleDeleteClick(tweetId){
    tweetsData = tweetsData.filter(tweet => tweet.uuid !== tweetId)
    saveToLocalStorage()
    render()
}

function saveToLocalStorage(){
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
}

function loadFromLocalStorage(){
    const storedTweets = localStorage.getItem('tweetsData')
    if(storedTweets){
        return JSON.parse(storedTweets)
    }
    return defaultTweetsData

}


function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="/chucknorris.jpeg" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="/musk.png" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <button class="delete-btn" data-delete="${tweet.uuid}">Delete</button>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
        <div class="reply-input-area">
            <textarea id="reply-input-${tweet.uuid}" class="reply-input" placeholder="Write a reply..."></textarea>
            <button data-reply-btn="${tweet.uuid}">Reply</button>
        </div>
    </div>  
</div>
`

   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

const darkModeToggle = document.getElementById('dark-mode-toggle')

// Load preference on page load
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode')
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode')
    const isDark = document.body.classList.contains('dark-mode')
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled')
    darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode'
})

// Set initial button text
darkModeToggle.textContent = 
    document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode'
