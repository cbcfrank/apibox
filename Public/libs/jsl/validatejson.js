/**
 * Created by chenyoufeng on 2014/10/28.
 */

    <script type="text/javascript" src="Public/libs/jsl/jsl.parser.js"></script>
    <script type="text/javascript" src="Public/libs/jsl/jsl.format.js"></script>



function getURLParameter(name) {
    param = (new RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || ['', null])[1];
    if (param) {
        return decodeURIComponent(param);
    } else {
        return null;
    }
}

function validatejson(jsonVal) {
    var lineNum, lineMatches, lineStart, lineEnd, jsonVal, result;
    var reformatParam = getURLParameter('reformat');
    var reformat      = reformatParam !== '0' && reformatParam !== 'no';
    var compress      = reformatParam === 'compress';
    try {
        result = jsl.parser.parse(jsonVal);
        if (result) {
            if (reformat) {
                // $('#json_input').val(
                result =        JSON.stringify(JSON.parse(jsonVal), null, "    ")
                //);
            }

            if (compress) {
                //$('#json_input').val(
                result =JSON.stringify(JSON.parse(jsonVal), null, "");
                //);
            }
        } else {
            alert("An unknown error occurred. Please contact Arc90.");
        }

        return result;
    } catch (parseException) {

        /**
         * If we failed to validate, run our manual formatter and then re-validate so that we
         * can get a better line number. On a successful validate, we don't want to run our
         * manual formatter because the automatic one is faster and probably more reliable.
         **/
        try {
            if (reformat) {
                jsonVal = jsl.format.formatJson($('#json_input').val());
                $('#json_input').val(jsonVal);
                result = jsl.parser.parse($('#json_input').val());
            }
        } catch(e) {
            parseException = e;
        }

        lineMatches = parseException.message.match(/line ([0-9]*)/);
        if (lineMatches && typeof lineMatches === "object" && lineMatches.length > 1) {
            lineNum = parseInt(lineMatches[1], 10);

            if (lineNum === 1) {
                lineStart = 0;
            } else {
                lineStart = getNthPos(jsonVal, "\n", lineNum - 1);
            }

            lineEnd = jsonVal.indexOf("\n", lineStart);
            if (lineEnd < 0) {
                lineEnd = jsonVal.length;
            }

            $('#json_input').focus().caret(lineStart, lineEnd);
        }

    }
}

