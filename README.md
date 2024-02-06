<H1>FIGMA ATTRIBUTES to HTML</H1>
<h3>Description:</H3>
Use your figma API and ID to generate in your HTML the figma file, add attributes to the names of the items ( [attribute] )
to differenciate what object is what (See accepted attributes)
<H3>How to make a Figma API Key</H3>
... for now google it
<H3>how to find the Figma Token ID for my page?</H3>
... for now also google it.
<H3>Add to your HTML to pull from your figma account and file:</H3>
Add to header:
<code>

    <script type="module">

        import {
          fetchData,
          displayFigmaData,
        } from "https://cdn.jsdelivr.net/gh/OzarkOC/figma2HTML/script.js";

      // Provide your API key and Figma ID
      const figmaApiKey = "Your_API_KEY";
      const figmaId = "YOUR_FIGAM_TOKEN";

      (async () => {
        try {
          const figmaData = await fetchData(figmaId, figmaApiKey);
          console.log(figmaData);

          // Call other functions to process the data if needed
          displayFigmaData(figmaData);
        } catch (error) {
          console.error("Error fetching Figma data:", error);
        }
      })();
    </script>   

</code>

<H3>Attributes:</H3>
<table>
<thead>
  <tr>
    <th>Attribute</th>
    <th>Description</th>
    <th>Placment</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>[Home]</td>
    <td>Distinguishes what should be the first page</td>
    <td>FRAME</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</tbody>
</table>
