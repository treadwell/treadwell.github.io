﻿
function showref(umbo)
{
  window.open(umbo.innerHTML.replace("&amp;","&"));
}

function showurl(umbo)
{
  window.open(umbo);
}


function sendRequest(url)
{
   var linkedStyle = document.createElement("link"); 
   linkedStyle.rel = "stylesheet"; 
   linkedStyle.type = "text/css"; 
   linkedStyle.href = url; 
 
   /* find the head to insert properly */
 
   var head = document.getElementsByTagName("head"); 
   if (head) 
     head[0].appendChild(linkedStyle); 
}








