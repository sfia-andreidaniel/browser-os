function DocumentEditor_interface_menu( app ) {
    
    app.menu = [
        {
            "caption": "File",
            "items"  : []
        },
        {
            "caption": "Edit",
            "items"  : [
                {
                    "caption": "Undo",
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQY1Nd8D2z0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAXUlEQVQ4y2N8//YeAyWAiYFCMPAGsBBSEJdw4j+62KIFFowwNiMsEOMSTvxHloBpRBbDJs6ETRJmGLpmbAYyYXMyNo0kBSI2f5McC7gMQRdnJCUlYgtYxtGkTLkBAGiONBErgyCSAAAAAElFTkSuQmCC",
                    "handler": app.appHandler,
                    "id": "cmd_undo",
                    "shortcut": "Ctrl + Z"
                },
                {
                    "caption": "Redo",
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQY2Hy+VQSgAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAZUlEQVQ4y2N8//YeAyWAiYFCMPAGsCBz4hJO/EdXsGiBBSNRBsA0o2vAJh6XcOI/jM9EyLZFCywYFy2wYIQZhO5KosMA2RCyDMCmGcMAXIpwiTMwMDAwIqdEXAGJDzCOJmXKDQAArswxWrIawecAAAAASUVORK5CYII=",
                    "handler": app.appHandler,
                    "id": "cmd_redo",
                    "shortcut": "Ctrl + Y"
                },
                null,
                {
                    "caption": "Cut",
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQYuKvs9HVIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAd0lEQVQ4y2N8//4eAyWACZtgdFzOf3x8ggZQ7AKqGABzNj7n4zRg6aIpjPj4RHuBkO14DYDZis92AmFw/D8yTZYXYLZHxx3/j8sgFlw2oxpkCTcIxsbqApgCdEU0TUgshBQsXWTJCPMWNpcxoudGfIqxAUZKszMAUhQ9VMLIyAwAAAAASUVORK5CYII=",
                    "handler": app.appHandler,
                    "id": "cmd_cut",
                    "shortcut": "Ctrl + X"
                },
                {
                    "caption": "Copy",
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQYvDt4lyMIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAtklEQVQ4y6WT4QnDIBCFn8GlsoJiBojgBB2nEwTMAIJZIVtkBUe4/iihWr3Ukgf+uSfn9zwVKR24IwkA1j2oZfrlKboaAEAMsTD0pLsIhiuTI2sS5Ke+aTYAHtbtVMYay1gpHVBG0beU8c2aMp5SOnAuyefeAMwVcgwz9LTSSSJLM2bN1kasT926nfwyip8EedMY5uqAbgJun+TnXhOwY2y9OOtW+ouAUxcBp/MeriTu/sYBN/UCk1t5qVqHtuwAAAAASUVORK5CYII=",
                    "handler": app.appHandler,
                    "id": "cmd_copy",
                    "shortcut": "Ctrl + C"
                },
                {
                    "caption": "Paste",
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQYvKXsvfakAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA3ElEQVQ4y6WTsQ3DIBBFP5GnsxX39kmeICVVBnDlMhNEwu4teQYvECmdV2AEUhCcI0BQ5GsODt3j3xcIrTcciSJWpO5i+F7dbyIFEFpvQQMALLPNVR02caAoz6WhBgAIgIKabLNrdGtq7DlAUJPaIe8RyJInYOgHPB/A0NsTt5ZXySCBB2qHyKvM2OZDCl7kMuMZOQWKeUHg4/k5ocDPwDK3wQBVPTIYcEop+BXL3IK61WQVfG6Ep8jVqFtNkVYQH4Pvq3r8T0EMlHzKAEVN/DZUpH6jMykX4uh3fgF6Imz1g6+FqwAAAABJRU5ErkJggg==",
                    "handler": app.appHandler,
                    "id": "cmd_paste",
                    "shortcut": "Ctrl + V"
                },
                {
                    "caption": "Paste as text",
                    "handler": app.appHandler,
                    "id": "cmd_paste_plain"
                },
                null,
                {
                    "caption": "Select All",
                    "id": "cmd_select_all",
                    "shortcut": "Ctrl + A",
                    "handler": app.appHandler
                },
                null,
                {
                    "caption": "Find and Replace",
                    "icon": "data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAAgAAAgIAAgICBAICBAQABAQCBAQEBgYEOfn5+/v5/f37/f39//3//r29v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAA0ALAAAAAAQABAAAAh2ABsIHEiwoMGDCAEoHAjAAICDAhYIYLjgoUEBAAIMRABgYkGFAxYqxGiRYkgDDQAsCDmAYACFAEICODByYUqVIRFUDFCRo8gBFRVWBOpzIc2gDTMGdfgQZkeMKUlibKmyY0mBVQe05Dnyo0SRMD0yVEgTIcKAAAA7",
                    "handler": app.appHandler,
                    "id": "cmd_find"
                }
            ]
        },
        {
            "caption": "View",
            "items"  : [
                {
                    "caption": "Show Blocks",
                    "input": "checkbox",
                    "checked": false
                },
                {
                    "caption": "Visual Aids",
                    "input": "checkbox",
                    "chekced": false
                },
                null,
                {
                    "caption": "Preview"
                }
            ]
        },
        {
            "caption": "Insert",
            "items"  : [
                {
                    "caption": "Break",
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAADAFBMVEUAAAAeQ0P//wADTccVPj6YmJj3kSsDMDBT7GIdH6IzMzMNODikCgAZNyywDgAcIqav1fPY2NkoK6FUV6knM67xsVOVsR8lRkb8/Pz/ZwHt11vslCTUOgEcQkLLVQaVmMi5FgAEWPRRj+z7fQ7HJgJpne7g3K9rbq8/QqXedwhxyOmFiLzf3uwPmwONgDV7qvFnXjRxlQ73xwsnRcUROzvxkRz/AACR1O7w8PLSuZ8YP0D8//9PcQYEGIbv6MjCgXDaaA2jpKT3XiuKJABPZcfix8IWPj4Yae7P5+a6y3gSTs8uSkpU7mDcdhjwildPUkO7r3gfZdy6V0Tq6u0NRcv39/e/29mnqKzASDgAM8z+/QL8/APohxgGOMe6wN1R7F6QuPTi4OoFMjL//gHn2dQ1TUyIiIj4+/ozTEwBIV1E3VPy7gzm5ubd2BKrrKz+/gL39ed4eHfLm4D2jxYxSk8pSEX2ojYdQUfm4hMxTEghRERycnKampp6rWcZPk749fMOFZ3w5eK3alJ3eHEAIKg8SkACLL8CJU+traE+UFAAOTmnp6zw7hEIM7AOKmAiQkShoZ78+wQHN78UPT0KQ9AUPEA5ge2tra0kRUVAUVH///8dHqDg4OCXl5cMcba0trb5myN0MQ3+kQSbv/XSbQAiX+UxS0sjREmIl6YnR0f+/v6/v8CUrbEMNzdwl690eYFsmdNWWFhdbXfH48jtumz5+fkbQUEeltcIRqMdW7Omrrj/mQBOwuxFc45oaGjy2po3nNPd6di6klV4eHiXueufn58UPD/2lx7KysqgWB/E2PgxaNs7T09kcoo+T1svtecVO0P/lAJ+fn0AMzOrsc3+/vYTW9obGpWFjJECQs75nCMDR9BpcnzWpFjp8eMkRUcHTNX19fUuS4oSRr0KTNGQlJkSPDw2eOc2kLcXU8zm6eHm7fyvrauoqKiqqqwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8sgvrAAABAHRSTlMA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wAAAAAAAAAAAAAAAAAAAAAAwSVPPQAAADVJREFUeJxjYMAA01EASGAWCEisAlMQAYT8HIQKCJhDrApxOMAlQIKhc/CpmAMB07F5Dg0AAEuOakuLvK8ZAAAAAElFTkSuQmCC",
                    "handler": app.appHandler,
                    "id": "cmd_insert_break"
                },
                {
                    "caption": "Date and time",
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAK3RFWHRDcmVhdGlvbiBUaW1lAFNvIDI4IFNlcCAyMDAzIDIzOjUzOjIwICswMTAwXt1uVAAAAAd0SU1FB9QHBwgcNKNc6GAAAAAJcEhZcwAACvAAAArwAUKsNJgAAAAEZ0FNQQAAsY8L/GEFAAAC60lEQVR42nWTXUgUURTH/7M7O7u2H2qp4AeKVCZWKFpJhWWWPZSWD/ZSBlH0IkUvChFFQSSE+K4PPkSUFEKBSmDkQ+saSmkfuonF7qqIaTm2M/sxO7M7tzO1Skhd+HGHy/n/z7nnnuHwn9XWNiAwPdya6hLO2VK4/O/Ly/Ozc4Engy97On0+3wqFaEac+Z/iewOC08ENVjUcvlhSU5aZWbJDyCktz0hz2qsFDfunPr8f0TRNptD4Pw1qahquH6irujji6UNhQTYc6XbE4sCm/DwIsOSLCwEuEPBNU2jQ9JeOWyPVZTnnzNuM43X1uNp0Hn7fEm41ncKXd5PIrag2TI9SXCnh4isr99jKyyt6V1eDdlWNLTc3NxcHfHKRkgAcqem4fPs+Ht64gt2HTqJg5y4wRudORw6JtxGjfGPj/UG/fzJHFIfSLZa0b/PzK1ZJiupBWTdHVBMKd5Vh+4km7Ks9DbNONf/UIK6IiyR2EBaTy7VlT0fHpa21tQc35xemlthShK0ZWWmWxXEPIlSFFAb2kpinzBxdeMb9DBMfJ9+TOGS8BK8oMdhsdrS0tAI9N6FWl4JJS3jwfBRzERlZpUdg2ZQCWQ7B96YfnoFHY16vVyLxV8OE1/XEnxZ2XwO+vwAfPgW8eooLx+rxesiNt/5xBKUg5mZnZz5+8k5MkZgx9oEURhUS2tvdUTpgGqG3NbD4tIdF52YZO5vLlDE3U3XG3G6vMTS9xF3iDFFEWI28Jl2Prz8lSy8EnNkQHt+BnlUMU383VGrcsOcrTQGWiUFiiPATMUPDJxIJrK4CohiHWtMOlXZW3wkdJigRDdbhKWiyMblQkiaikWstKU+VQxBAjeRhZToSVjN4ngPHcZB5Mzg1SkGx9SI3Ti0fjYaDXV19dlGUQuFwKGIgSXIkFJKVSESOqVospijB8O+G0exvNDFGN484TRQQevIvU5P72rdR/gIxRvzYaGB0M5NISbrr/8G4h5ysYn39ArlAWEV3uTRTAAAAAElFTkSuQmCC",
                    "id": "cmd_insert_datetime",
                    "handler": app.appHandler
                },
                {
                    "caption": "Symbol",
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODVCNUQzNjg1RDdFMTExOUIzNEIzOEVDOTExMDgyNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxNDJGODVBREVEMzcxMUUxQkRBMjk1NEFDQjRCN0Y0RiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNDJGODVBQ0VEMzcxMUUxQkRBMjk1NEFDQjRCN0Y0RiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA4NUI1RDM2ODVEN0UxMTE5QjM0QjM4RUM5MTEwODI1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA4NUI1RDM2ODVEN0UxMTE5QjM0QjM4RUM5MTEwODI1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+EQvFEAAAAPxJREFUeNpiTEtLYyAXzJw5k4GJgUKAzQAVIJ4AxGeA+A8Ug9iToXJ4DfAD4ktA7AHENUAsAMUgtitUzg9ZAwsSWxeIlwLxUyA2AeIvSHI7oGKXoGqsgPgyugu6gJgHiMvQNMMASKwYqqYLmxcsofRuPGEGk7PBF4hseAyAyf3FZgDMdA88BniguxLZgEog/g71nzQWzdJQue9QtRgG3AFiZyBmBuLDQGyMJGcMFWOGqrmDKwyOA7EqEB8B4igk8XComCpUDdaE1IsUXa3QdAEDBlCxL2hqUQwoAuL/UHwDqgnZgBtI8kXYUiIjntAXwyXB+P//f4pyI0CAAQA6jzYeGS1RgQAAAABJRU5ErkJggg==",
                    "handler": app.appHandler,
                    "id": "cmd_insert_symbol"
                },
                null,
                {
                    "caption": "Media",
                    "items": [
                        {
                            "caption": "Picture",
                            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90ICQkkI3NSCkEAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAxElEQVQ4y6WTsQ3CMBBFXxDr+ffXIDagzwBe5XoPlA2ijGCKJNgYAoH85iTL9+78JHfTOHAkZ4DL9Zb/JkzjQAgh5xzynP01hJBPBZUAbVZ3QxISuPtyDhVAHyHujhmYrQC1gPQF0iYViXs2MPNlMphZgRaJ+WeRjcTniauwb89660ASZoaZPSASSC3kjYO1GVjMG5ITY5xvSaS0sUHdXGTNte97AGKM1SYVoJ28pjb/CqkA7eS6cQsC0E3jcOgzdUe/8x3Uo9QMo4dUUAAAAABJRU5ErkJggg=="
                        },
                        {
                            "caption": "Movie",
                            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALawAAC2sBAA3gSgAAAAd0SU1FB90FFwokGIhJuSEAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA2UlEQVQ4y52TwU7DMBBE30aV4IYKlXrjH7jyc5n8ISfoF/TApRIScBwOsY2dJiV0pWi80cx41paDxVIH3KVmL/GW1u+S9pm1mRFu0+JR4iX/7fsegIj4rNkxEd9KfM+IToUhHSQ9Twx+hZUoc07APRdm3UqyjW0MGPhifekBaAwk/YXH2mA3JrBHo3WYRqPL5xAR2F6Fksr2XfoYjddjbdBeZSy3McTZCZYEhW0X1aSdrTZBZpe4TbtocDHBzFRNbc4SVDjd2b2XDYZh4JrKb+EG9PpP7Qfw9APV9Jvgm9qjqAAAAABJRU5ErkJggg=="
                        }
                    ]
                },
                {
                    "caption": "Link",
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB90ICQkrB8jJ8l8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABNElEQVQ4y52STYrCQBCFv4iCdzG6CHiMyr6uEXATXEo2Ax5jep9rCEJMC5F4FnsWmU5ifhyYgqaT6tevXr3qoK4KfFyud8dE7KNNwEwshpcNsN1u2Ucb9tEGgyE5HN0cQVBXBZfr3akq1lrCMOT5uJFcj+9IA+ev00jJ0leOY8jzEGstaboD8g6lMWijctjOAsAYJcssz8eN9erVlNO4WX0RxoxaWPqP9erVyVZ/Q0FNt38yMTnsOEen91M1v7YqmPwzgSeZBM5U7xHMA9pWMKjq9BibOfcrx0MJoyLtSOuqoK4KRMSJfDsRcWVZOudcu4vI239Zlk5EXF0VjYLOg6PLsow0TfkrPG4xPAjDsBGtGnigX/28xy2HBNZa/2gcMFLj8x7XetD34t8e9L0YOj6VA/gBWOzfdfqCxAUAAAAASUVORK5CYII=",
                    "id": "cmd_hyperlink",
                    "handler": app.appHandler,
                    "items": [
                        {
                            "caption": "Unlink",
                            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB90IDAk7NuQLEAYAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABW0lEQVQ4y32TQYqDQBBFnyEDc5AsAokTCOQY5b49hpCNuAxuAjlGeq/HCAhiBwRzlqlZGI2aOAVCd1f/X9W/vl5Tl3RxK+7KhzjsNx4zsZiCLeD7Pof9hsN+g8USHROdI/CauuRW3NUYg3OOre/zqEuiIhnftHA5n7zVeqePuuw7WnaVgwCy3Adgtd6BDIqaAAys1jt95nuSBYC1hjR1PAZ6ZLnXArt9mPfrYQe9Bt9fv0RFQnCVMcjYWfCIIDr+cNmfACYkYb8OROan0JFgszeSFqz/jdG+JYZtd5oYY94JWpPYWfCwbROGRMdER75o6pKmLhERFbmqQv9VVaWqqiLydi4i2tRla6QuujnPCZblr85cVRHHMcuxUEKW5wQiGGM8a62mafrKP0kCEbLttnXitIqrKohjrLUKEMcx0yIAzrmxBkMturePNBjsZzV4+WH8913OJ+/TGcAfOunoeVDvPNkAAAAASUVORK5CYII=",
                            "id": "cmd_hyperlink_unlink",
                            "handler": app.appHandler
                        }
                    ]
                },
                null,
                {
                    "caption": "Template",
                    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNXG14zYAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDcvMDEvMTEN2r9cAAABbElEQVQ4jY2RP0srURDFf/clJMX2dpplV9KksNxKWyH+qXJ52GsXgvgB7GxFFr+DmLsEkRCwSp3qVWnCI4Q0Vpbpcu9YxN0YE3UPDMMd5pw5M1e1220hJ0qlkvi+fzYajR4BtNYoY4w0Go1fydZaOp0O5XJZKpVKJvIn7/RCoQBArVZT0+n0oVqt/gUopg3GGLTWGGNWiFprrp9eGYxnnG9DGIYAajgcPoRhuJdrhcPb/whwsf1vpa6UyucAoNfyqceLfBRPeLnaJUmSpUDamOavcM7Rbe5QjyeoT/UigIiQJMm3DqLA4+R+urANRIG3bDDGyHw+Xwtr7Uo451ZCRMQYI0VY/PFN743BePbjMVNEgcf1ydZyBWstg/GM3mWQS6B+N8ZauxRwzmWHOo4ndFs+x/FkI7nb8vnMyRykxefmTpY3ISWuOYgCj9OPS/+GKPDWHbT2S6iD8lqzUmrjO3MgIvT7/VyTv0JEeAemBN8AyL1vhgAAAABJRU5ErkJggg=="
                },
                null,
                {
                    "caption": "AddOn Component",
                    "icon": "data:image/gif;base64,R0lGODlhEAAQAPcDAAAAAP///xMXIf3898+iFs+lH82jItOoJd+4QGVVIKWSWOzcp8yWAMqUAMmUAMiTAMiVAMeTAMaTAMWRAMOQAMKPAMGNAMGOAMCMANymEtSjEcaWEMWVFNSjFt+qGdelGNakGd2sGnJXDsaYGdSlHNmoHtinId6tJK6IHbeQH9ytJlxIEldFEV9LE9msLltIFFhGFVdFFe2+Ps6pOuTBWt++Yb2iVO7PdvLVhebMf8qycjs1JfPku/bsz/z58MmSAMiRAMWPAMKMAMCLAL2GALyHALqFALeEALaDALSAALOAALJ+ALF9AK98ALJ/Aqh3Aq5/A6F0BYlmCn5dC8mXE8KPFsqXHbOJG+mzKuq1NOSyMvG7N+u4NuCvM1ZDFFVCFPnBPOu3OHJbHlA/FdqsOtWoOv/KRpV2KfXCSUc5FolvLsqjRvXGVm5aKmtZKm9cLv/VbJR7P//YcWZWLm5eNFBFKd7Pqfr487J9AK96AKt4AKh1AKZzAKJvAKNxBqh4EKd3EKh5Eap8EltEEVZCE/C6PP/HSPvER8meOvXASPzFS8SaO//JTv/KUcmfQXFcK/XIY2JQKfjOb2NSLVxNKqSJTGJSLsCiXti4ckxBKf/hn6JuAZpoAaNwBKRxBql2Cp9tDK6HPN7Ko9XCnenYtrGFNMqrcc+0gismHfDl0kpDN+vfyy0pI/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAMALAAAAAAQABAAAAjRAAcIHEiwYMEcCmacyEDChkEXWrIgUiOgDqtHZ65QWTMQBBxVlRwlMrSIThwZKjQIEtih0SQ5A3DQQBCCBYMJEAAJ/MDIkiJJBBxEYACjwQUKfgSiKDPnEKQCEig8iBEEwxBPAku82WGGjYEKFn68GCLFyyeBJsBQioTmABAoIlCNmeLkj8BNWNyQyZQgTYsoK4gsYRJo4KY2WwqlEFLEyBc8evoUFNMlzIgjSpoQysOHk8EqXDggSfJk0KZSBgVa2YBkD6hNqQl2CgU7tu2CAQEAOw=="
                }
            ]
        },
        {
            "caption": "Format",
            "items"  : []
        },
        {
            "caption": "Tools",
            "items"  : []
        },
        {
            "caption": "Table",
            "items"  : []
        },
        {
            "caption": "Window",
            "items"  : []
        },
        {
            "caption": "Help",
            "items"  : []
        }
    ];
    
}