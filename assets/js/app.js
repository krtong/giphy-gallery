            let giphys = ["The Matrix", "The Notebook", "Mr. Nobody", "The Lion King"];
            let numOfGifs = 10;
            let imgObj = {};
            
            function renderImg() {
                let idx = $(this).attr("id");
                let newClass = $(this).attr("class").includes("animated") ? "static" : "animated";
                let giphyName = $(this).attr("data-name");
                $(this).attr("src", imgObj[giphyName][idx][newClass]);
                // newClass += "card-img-top";
                $(this).attr("class", newClass + " card-img-top");
            };

            function grabGiphyImages(titleStr, dataArr) {
                let arr = []
                dataArr.forEach(obj => {
                    console.log(obj)
                    let tempObj = {};
                    tempObj.animated = obj.images['fixed_height'].url;
                    tempObj.date = ((date = obj.import_datetime) => `${['January', 'Febuary', 'March', 'April', 'June', 'July', 'August', 'Septemper', 'Octoeber', 'November', 'December'][date.slice(5, 7)-1]} ${date.slice(8, 9)}, ${date.slice(0, 4)}`)();
                    tempObj.height = obj.images['fixed_height'].height;
                    tempObj.rating = obj.rating;
                    tempObj.source = obj.source_tld
                    tempObj.sourceURL = obj.source;
                    tempObj.static = obj.images['fixed_height_still'].url;
                    tempObj.title = obj.title;
                    tempObj.width = obj.images['fixed_height'].width;
                    arr.push(tempObj)
                });
                imgObj[titleStr] = arr;
            };

            function alertGiphyName() {
                $("#add-shit-here").empty();
                let giphyName = $(this).attr("data-name");
                let id = $(this).attr("id")
                if (imgObj[giphyName]) {
                    populateImages(imgObj[giphyName])
                } else {
                    $.ajax({
                        url: `https://api.giphy.com/v1/gifs/search?api_key=FMm6h8iCj05LtP1gHs2RaqXNkERa7HxZ&q=${giphyName}&limit=${numOfGifs}&offset=0&rating=G&lang=en`,
                        method: "GET"
                    }).then(function (response) {
                        if (response.data.length === 10 ? false : true) {
                            alert("no images found")
                        } else {
                            grabGiphyImages(giphyName, response.data)
                            populateImages(imgObj[giphyName], giphyName);
                        }
                    });
                }
            };

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

            function populateButtons() {
                let bgColor = ['38141B', '441E2D', '71B4B7', '6DF2E9', '35F2B0', '6DF2E9', '71B4B7', '441E2D']
                $("#buttons-view").empty();
                giphys.forEach((giphy, idx) => {
                    $("#buttons-view").append(`
                        <button id="button-${idx}" class="giphy btn btn-outline" style="background-color: #${bgColor[idx%8]}" data-name="${giphy}">${giphy}</button>
                    `);
                });
            };
            $("#add-giphy").on("click", function (event) {
                event.preventDefault();
                let giphy = $("#giphy-input").val().trim();
                let validInput = giphy.length > 2 ? true : false;
                if (validInput) {
                    giphys.push(giphy);
                    giphys = giphys.length > 15 ? giphys.slice(1, 16) : giphys;
                    populateButtons();
                }
            });
            
            $(document).on("click", ".giphy", alertGiphyName);
            $(document).on("click", ".static, .animated", renderImg);
            populateButtons();