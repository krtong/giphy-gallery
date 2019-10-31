            //global variables
            const giphys = ['Trending', 'Trippy','Ultraman',  'METAL', 'Mandelbrot', 'Captain Planet', 'geometric', 'Skate or Die', 'Fibonacci', 'Perfect Loop', 'Chillwave', ];
            const apiKey = 'FMm6h8iCj05LtP1gHs2RaqXNkERa7HxZ';
            const numOfGifs = 20;
            const imgObj = {};

            $("#add-shit-here").empty();

            //tIMG click => Toggle between 'static' and 'animated'
            function renderImg() {
                const idx = $(this).attr("id");
                const newClass = $(this).attr("class").includes("animated") ? "static" : "animated";
                const giphyName = $(this).attr("data-name");

                $(this).attr("src", imgObj[giphyName][idx][newClass]);
                $(this).attr("class", `${newClass} card-img-top`);
            };

            // create data obj on ajax get response
            function grabGiphyImages(titleStr, dataArr) {
                imgObj[titleStr] = [];
                dataArr.forEach(obj => {
                    if(obj.images['fixed_height'].url)
                    imgObj[titleStr].push({
                        animated: obj.images['fixed_height'].url,
                        date: ((date = obj.import_datetime) => `${['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December'][date.slice(5, 7)-1]} ${parseInt(date.slice(8,10))}, ${date.slice(0, 4)}`)(),
                        rating: obj.rating.toUpperCase(),
                        source: obj.source_tld,
                        sourceURL: obj.source,
                        static: obj.images['fixed_height_still'].url,
                        title: obj.title
                    })
                    else console.log('err', obj);
                });
            };

            // Button click => AJAX 'GET' Request
            function alertGiphyName(event, searchType = 'search', giphyName = $(this).attr("data-name"), offset = 0) {
                $("#add-shit-here").empty();
                if (imgObj[giphyName]) {
                    populateImages(imgObj[giphyName], giphyName)
                } else {
                    $.ajax({
                        url: `https://api.giphy.com/v1/gifs/${searchType}?api_key=${apiKey}${searchType === 'search' ? `&q=${giphyName}` : ''}&limit=${numOfGifs}&offset=${offset}&lang=en&rating=R`,
                        method: "GET"
                    }).then(function (response) {
                        if (response.data.length === numOfGifs ? false : true) {
                            alert("no images found")
                        } else {
                            grabGiphyImages(giphyName, response.data)
                            populateImages(imgObj[giphyName], giphyName);
                        }
                    });
                }
            };

            //AJAX Request 'success' => populate images on document
            function populateImages(dataObj, dataName) {
                $("#add-shit-here").empty();
                let addShitHereHTML = '';
                let preRenderHTML = ''
                dataObj.forEach((imgObj, idx) => {
                    addShitHereHTML += `
                    <div class="card ${idx%2<1? 'rotate-1' : 'rotate-2'}">
                      <img src="${imgObj.static}" class="static card-img-top" data-name="${dataName}" id="${idx}">
                      <div class="card-body">
                        <h5 class="card-title">${imgObj.title? imgObj.title : 'Untitled Gif'}</h5>
                        <p class="card-text">This gif was originally posted ${imgObj.date}${imgObj.source ? ` by: <a href="${imgObj.sourceURL}"> ${imgObj.source}</a>.`: `.`}</p>
                      </div>
                      <div class="card-footer">
                        <small class="text-muted"><a href="https://github.com/Giphy/GiphyAPI/issues/55">Rating: ${imgObj.rating}</a></small>
                      </div>
                    </div>`;

                    preRenderHTML += `<img src="${imgObj['animated']}">`;
                });
                addShitHereHTML += `<br /><br /><button class="btn btn-outline-warning" id="add-more">more</button>`;

                $("#add-shit-here").html(addShitHereHTML)
                $("#prerender").html(preRenderHTML)
            };

            //Form submit => create & repopulate buttons
            function populateButtons() {
                let bgColor = ['magenta', 'purple', 'blue', 'lime', 'gold', 'orange', 'red'];
                $("#buttons-view").empty();
                giphys.forEach((giphy, idx) => {
                    $("#buttons-view").append(`
                        <button id="button-${idx}" class="giphy btn btn-outline" style="background-color: ${bgColor[idx%bgColor.length]}" data-name="${giphy}">${giphy}</button>
                    `);
                });
            };

            //populate page with trending pictures on page load.
            alertGiphyName('', 'trending', 'Trending')
            populateButtons();

            //Set up event listeners 
            $("#add-giphy").on("click", function (event) {
                let giphy = $("#giphy-input").val().trim();
                let validInput = giphy.length > 2 ? true : false;

                event.preventDefault();
                if (validInput) {
                    giphys.push(giphy);
                    giphys.length > 27 ? giphys.splice(1, 1) : giphys;
                    populateButtons();
                }
            });

            //Set up more event listeners.
            $(document).on("click", ".giphy", alertGiphyName);
            $(document).on("click", ".static, .animated", renderImg);
            $(document).on("click", ".more", renderImg);
            $(document).on("mouseover", ".static, .animated", function () {
                $(this).css('cursor', 'pointer')
            });