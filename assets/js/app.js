//global variables
//starting array of buttons. Leave trending alone. It's not like the other buttons.
const giphys = ['Trending', 'Trippy', 'Ultraman', 'METAL', 'Mandelbrot', 'Captain Planet', 'geometric', 'Skate or Die', 'Fibonacci', 'Perfect Loop', 'Chillwave', ],
    //rip API key.
    apiKey = 'FMm6h8iCj05LtP1gHs2RaqXNkERa7HxZ',
    //change this # to whatever number you want, but just know that higher numbers may cause animations to load very slowly.
    numOfGifs = 10,
    numOfBtns = 27,
    //stores image data from the API to cut down on AJAX calls.
    imgObj = {};

//IMG click => Toggle between 'static' and 'animated'
function renderImg() {
    const idx = $(this).attr("id"),
        newClass = $(this).attr("class").includes("animated") ? "static" : "animated",
        giphyName = $(this).attr("data-name");

    $(this).attr("src", imgObj[giphyName][idx][newClass]);
    $(this).attr("class", `${newClass} card-img-top`);
};

// create data obj on ajax get response
function buildArrayOfImageObjects(titleStr, dataArr, number) {
    imgObj[titleStr] = [];

    dataArr.forEach(obj => {
        imgObj[titleStr].push({
            offset: number,
            animated: obj.images['fixed_width'].url,
            date: ((date = obj.import_datetime) => `${['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December'][date.slice(5, 7)-1]} ${parseInt(date.slice(8,10))}, ${date.slice(0, 4)}`)(),
            rating: obj.rating.toUpperCase(),
            source: obj.source_tld,
            sourceURL: obj.source,
            static: obj.images['fixed_width_still'].url,
            title: obj.title,
            height: obj.images['fixed_width'].height,
        });
    });
};

// Button click => AJAX 'GET' Request
function returnImageDataFromAPI(notUsed, searchType = 'search', giphyName = $(this).attr("data-name"), offset = 0) {
    //this looks incredibly stupid because I wanted to make queries AND get trending results from one function.
    $("#add-shit-here").empty();
    if (imgObj[giphyName] && offset === 0) {
        populateImages(imgObj[giphyName], giphyName)
    } else {
        $.ajax({
            url: `https://api.giphy.com/v1/gifs/${searchType}?api_key=${apiKey}${searchType === 'search' ? `&q=${giphyName}` : ''}&limit=${numOfGifs}&offset=${offset}&lang=en&rating=R`,
            method: "GET"
        }).then(function (response) {
            if (response.data.length === numOfGifs ? false : true) {
                alert("no images found")
            } else {
                buildArrayOfImageObjects(giphyName, response.data, offset ? offset : 0)
                populateImages(imgObj[giphyName], giphyName);
            };
        });
    };
};

//AJAX Request 'success' => populate images on document
function populateImages(imgArr, dataName) {
    // splits the imgArr up by heights so the column heights are as even as possible.
    imgArr.sort((a, b) => a.height > b.height ? -1 : 1).sort(a => imgArr.indexOf(a) % 2 > 0 ? 1 : -1);

    // renders images to page   
    let [addShitHereHTML, preRenderHTML] = ['', ''];
    $("#add-shit-here").empty();

    imgArr.forEach((imgObj, idx) => {
        addShitHereHTML += `
                        <div class="card ${idx%2<1? 'rotate-left' : 'rotate-right'}">
                            <img src="${imgObj.static}" class="static card-img-top" data-name="${dataName}" id="${idx}">
                            <div class="card-body">
                                <h5 class="card-title">
                                    ${imgObj.title? imgObj.title : 'Untitled Gif'}
                                </h5>
                                <p class="card-text">
                                    This gif was originally posted ${imgObj.date}${imgObj.source ? ` by: <a href="${imgObj.sourceURL}">${imgObj.source}</a>.`: `.`}
                                </p>
                            </div>
                            <div class="card-footer">
                                <small class="text-muted">
                                    <a href="https://github.com/Giphy/GiphyAPI/issues/55">
                                        Rating: ${imgObj.rating}
                                    </a>
                                </small>
                            </div>
                        </div>`;

        preRenderHTML += `
                        <img src="${imgObj['animated']}">`;
    });
    addShitHereHTML += dataName === 'Trending' ? `
                    <button class="btn btn-outline-warning" id="add-more" query="${dataName}">
                        more
                    </button>` : '';

    $("#add-shit-here").html(addShitHereHTML)
    $("#prerender").html(preRenderHTML)
};

//Form submit => create & repopulate buttons
function populateButtons() {
    const bgColor = ['magenta', 'purple', 'blue', 'lime', 'gold', 'orange', 'red'];

    $("#buttons-view").empty();
    giphys.forEach((giphy, idx) => {
        $("#buttons-view").append(`
            <button id="button-${idx}" class="giphy btn btn-outline" style="background-color: ${bgColor[idx%bgColor.length]}" data-name="${giphy}">
                ${giphy}
            </button>`);
    });
};

//populate page with trending pictures on page load.
returnImageDataFromAPI('', 'trending', 'Trending');
populateButtons();

//Set up event listeners 
$("#add-giphy").on("click", function (event) {
    const giphy = $("#giphy-input").val().trim();
    const validInput = giphy.length > 2 ? true : false;

    event.preventDefault();
    if (validInput) {
        giphys.push(giphy);
        giphys.length > numOfBtns ? giphys.splice(1, 1) : giphys;
        populateButtons();
    }
});


function newGifs(){
    event.preventDefault()
    let titleStr = $(this).attr("query")
    console.log("click")
    console.log(titleStr)
    let key = titleStr.toLowerCase();
    console.log(imgObj[key])
    console.log(imgObj)
    returnImageDataFromAPI('', titleStr.toLowerCase(), titleStr, imgObj[titleStr][0].offset + numOfGifs);
}


//Set up more event listeners.
$(document).on("click", ".giphy", returnImageDataFromAPI);
$(document).on("click", ".static, .animated", renderImg);
$(document).on("mouseover", ".static, .animated", function () {
    $(this).css('cursor', 'pointer')
});
$(document).on("click", "#add-more", newGifs)