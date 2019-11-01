            //global variables
            //starting array of buttons. Leave trending alone. It's not like the other buttons.
            const giphys = ['Trending', 'Trippy', 'Ultraman', 'METAL', 'Mandelbrot', 'Captain Planet', 'geometric', 'Skate or Die', 'Fibonacci', 'Perfect Loop', 'Chillwave', ];
            //rip API key.
            const apiKey = 'FMm6h8iCj05LtP1gHs2RaqXNkERa7HxZ';
            //change this # to whatever number you want, but just know that higher numbers may cause animations to load very slowly.
            const numOfGifs = 20;
            //stores image data from the API to cut down on AJAX calls.
            const imgObj = {};
            
            //IMG click => Toggle between 'static' and 'animated'
            function renderImg() {
                const idx = $(this).attr("id");
                const newClass = $(this).attr("class").includes("animated") ? "static" : "animated";
                const giphyName = $(this).attr("data-name");

                $(this).attr("src", imgObj[giphyName][idx][newClass]);
                $(this).attr("class", `${newClass} card-img-top`);
            };

            // create data obj on ajax get response
            function buildArrayOfImageObjects(titleStr, dataArr) {
                imgObj[titleStr] = [];
                dataArr.forEach(obj => {
                    if (obj.images['fixed_height'].url)
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
            function returnImageDataFromAPI(event, searchType = 'search', giphyName = $(this).attr("data-name"), offset = 0) { 
                //this looks incredibly stupid because I wanted to make queries AND get trending results from one function.
                $("#add-shit-here").empty();
                if (imgObj[giphyName]) {
                    populateImages(imgObj[giphyName], giphyName)
                } else {
                    $.ajax({
                        url: `https://api.giphy.com/v1/gifs/${searchType}?api_key=${apiKey}${searchType === 'search' ? `&q=${giphyName}` : ''}&limit=${numOfGifs}&offset=${offset}&lang=en&rating=R`,
                        method: "GET"
                    }).then(function(response) {
                        if (response.data.length === numOfGifs ? false : true) {
                            alert("no images found")
                        } else {
                            buildArrayOfImageObjects(giphyName, response.data)
                            populateImages(imgObj[giphyName], giphyName);
                        }
                    });
                }
            };

            //AJAX Request 'success' => populate images on document
            function populateImages(dataObj, dataName) {
                $("#add-shit-here").empty();
                let addShitHereHTML = '';
                let preRenderHTML = '';
                dataObj.forEach((imgObj, idx) => {
                    addShitHereHTML += `
                        <div class="card ${idx%2<1? 'rotate-1' : 'rotate-2'}">
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
                addShitHereHTML += `
                    <br /><br /><button class="btn btn-outline-warning" id="add-more">more</button>`;
                $("#add-shit-here").html(addShitHereHTML)
                $("#prerender").html(preRenderHTML)
            };

            //Form submit => create & repopulate buttons
            function populateButtons() {
                const bgColor = ['magenta', 'purple', 'blue', 'lime', 'gold', 'orange', 'red'];
                $("#buttons-view").empty();
                giphys.forEach((giphy, idx) => {
                    $("#buttons-view").append(`
                        <button id="button-${idx}" class="giphy btn btn-outline" style="background-color: ${bgColor[idx%bgColor.length]}" data-name="${giphy}">${giphy}</button>
                    `);
                });
            };

            //populate page with trending pictures on page load.
            returnImageDataFromAPI('', 'trending', 'Trending')
            populateButtons();

            //Set up event listeners 
            $("#add-giphy").on("click", function(event) {
                const giphy = $("#giphy-input").val().trim();
                const validInput = giphy.length > 2 ? true : false;

                event.preventDefault();
                if (validInput) {
                    giphys.push(giphy);
                    giphys.length > 27 ? giphys.splice(1, 1) : giphys;
                    populateButtons();
                }
            });

            //Set up more event listeners.
            $(document).on("click", ".giphy", returnImageDataFromAPI);
            $(document).on("click", ".static, .animated", renderImg);
            $(document).on("mouseover", ".static, .animated", function(){ $(this).css('cursor','pointer')});