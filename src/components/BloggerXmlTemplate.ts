export function generateBloggerXml(
  blogTitle: string,
  blogDesc: string,
  contactEmail: string,
  primaryColor: string,
  secondaryColor: string,
  githubUsername: string = "yourusername",
  githubRepo: string = "yourrepo",
  useDistFolder: boolean = false
): string {
  // Let's create a minimal headless Blogger XML template.
  // It provides the required layoutVersion='2' and b:skin tags.
  // This shell delegates all rendering to the React app hosted on GitHub Pages.

  const basePath = useDistFolder 
    ? `https://${githubUsername}.github.io/${githubRepo}/dist/assets`
    : `https://${githubUsername}.github.io/${githubRepo}/assets`;

  return `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:defaultmessages='false' b:layoutsVersion='2' b:responsive='true' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/schemas/2005/b' xmlns:data='http://www.google.com/schemas/2005/data' xmlns:expr='http://www.google.com/schemas/2005/gml'>
<head>
  <meta charset='utf-8'/>
  <meta content='width=device-width, initial-scale=1, shrink-to-fit=no' name='viewport'/>
  <title><data:blog.pageTitle/></title>
  
  <!-- SEO & Description -->
  <meta name="description" content="${blogDesc}" />

  <!-- Blogger Core XML Configuration (Required) -->
  <b:skin><![CDATA[
    /* Custom Theme Skin */
    body {
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, sans-serif;
    }
  ]]></b:skin>

  <!-- Connect to GitHub Pages Hosted Assets -->
  <link rel="stylesheet" crossorigin="anonymous" href="${basePath}/index.css" />
</head>
<body>

  <!-- The React App Mounting Point -->
  <div id="root">
    <div style="padding: 40px; text-align: center; font-family: sans-serif;">
      <h2>Loading Community Portal...</h2>
      <p style="color: #666;">If this screen remains for more than a few seconds, there is an issue loading the GitHub Pages assets. Please check your browser's Developer Console (F12) for 404 errors.</p>
    </div>
  </div>

  <!-- Blogger Required Structural Section -->
  <!-- This is hidden because our React app handles the UI, but Blogger requires at least one b:section -->
  <div style="display: none;">
    <b:section id='main' showaddelement='yes'>
      <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog' visible='true'>
        <b:includable id='main' var='top'>
           <!-- Minimal includable to satisfy Blogger validation -->
        </b:includable>
      </b:widget>
    </b:section>
  </div>

  <!-- Load the compiled React JS from GitHub Pages -->
  <script type="module" crossorigin="anonymous" src="${basePath}/index.js"></script>

</body>
</html>`;
}
