            //global variables
            let giphys = ['Trending', 'Random', 'Mr. Nobody', 'The Lion King'];
            let apiKey = 'FMm6h8iCj05LtP1gHs2RaqXNkERa7HxZ';
            let numOfGifs = 10;
            let imgObj = {};

            //populate page with trending pictures on page load.
            
            //toggle static/animated gif on image click
            function renderImg() {
                let idx = $(this).attr("id");
                let newClass = $(this).attr("class").includes("animated") ? "static" : "animated";
                let giphyName = $(this).attr("data-name");

                $(this).attr("src", imgObj[giphyName][idx][newClass]);
                $(this).attr("class", `${newClass} card-img-top`);
            };

            // create data obj on ajax get response
            function grabGiphyImages(titleStr, dataArr) {
                let arr = [];
                dataArr.forEach(obj => {
                    console.log(obj)

                    let tempObj = {
                        animated: obj.images['fixed_height'].url,
                        date: ((date = obj.import_datetime) => `${['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December'][date.slice(5, 7)-1]} ${date.slice(8, 9)}, ${date.slice(0, 4)}`)(),
                        rating: obj.rating,
                        source: obj.source_tld,
                        sourceURL: obj.source,
                        static: obj.images['fixed_height_still'].url,
                        title: obj.title
                    };


                    arr.push(tempObj)
                });
                imgObj[titleStr] = arr;
            };

            // ajax get request on button click
            function alertGiphyName(event, searchType = 'search', giphyName = $(this).attr("data-name"),offset=0) {
                $("#add-shit-here").empty();
                if (imgObj[giphyName]) {
                    populateImages(imgObj[giphyName])
                } else {
                    $.ajax({
                        url: `https://api.giphy.com/v1/gifs/${searchType}?api_key=${apiKey}${searchType === 'search' ? `&q=${giphyName}` : ''}&limit=${numOfGifs}&lang=en&rating=R`,
                        method: "GET"
                    }).then(function (response) {
                        console.log(`${giphyName}::::::`, response)
                        if (response.data.length === numOfGifs ? false : true) {
                            alert("no images found")
                        } else {
                            grabGiphyImages(giphyName, response.data)
                            populateImages(imgObj[giphyName], giphyName);
                        }
                    });
                }
            };

            //populate images on ajax get response
            function populateImages(dataObj, dataName) {
                $("#add-shit-here").empty();
                dataObj.forEach((imgObj, idx) => {
                    $("#add-shit-here").append(`
                    <div class="card">
                      <img src="${imgObj.static}" class="static card-img-top" data-name="${dataName}" id="${idx}">
                      <div class="card-body">
                        <h5 class="card-title">${imgObj.title? imgObj.title : 'Untitled Gif'}</h5>
                        <p class="card-text">This gif was originally posted ${imgObj.date}${imgObj.source ? ` by: <a href="${imgObj.sourceURL}"> ${imgObj.source}</a>.`: `.`}</p>
                      </div>
                      <div class="card-footer">
                        <small class="text-muted"><a href="https://github.com/Giphy/GiphyAPI/issues/55">Rating: ${imgObj.rating.toUpperCase()}</a></small>
                      </div>
                    </div>
                    `);
                    $("#prerender").append(`<img src="${imgObj['animated']}">`)
                });
            };

            //create buttons on form input
            function populateButtons() {
                // let bgColor = ['38141B', '441E2D', '71B4B7', '6DF2E9', '35F2B0', '6DF2E9', '71B4B7', '441E2D']
                let bgColor = ['9400D3', '4B0082', '0000FF', '00FF00', 'FFFF00', 'FF7F00', 'FF0000']
                $("#buttons-view").empty();
                giphys.forEach((giphy, idx) => {
                    $("#buttons-view").append(`
                        <button id="button-${idx}" class="giphy btn btn-outline" style="background-color: #${bgColor[idx%bgColor.length]}" data-name="${giphy}">${giphy}</button>
                    `);
                });
            };


            //form input
            $("#add-giphy").on("click", function (event) {
                let giphy = $("#giphy-input").val().trim();
                let validInput = giphy.length > 2 ? true : false;

                event.preventDefault();
                if (validInput) {
                    giphys.push(giphy);
                    giphys.length > 15 ? giphys.splice(1, 1) : giphys;
                    populateButtons();
                }
            });

            $(document).on("click", ".giphy", alertGiphyName);
            $(document).on("click", ".static, .animated", renderImg);
            
            alertGiphyName('', 'trending', 'Trending')
            // grabGiphyImages('Trending', 'trending')
            // populateImages()
            populateButtons();
