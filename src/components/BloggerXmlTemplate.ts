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

  const versionTag = `?v=${Date.now()}`;
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

  <!-- Connect to GitHub Pages Hosted Assets (with cache buster) -->
  <link rel="stylesheet" crossorigin="anonymous" href="${basePath}/index.css${versionTag}" />
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
  <!-- Renders post data into DOM so React can display individual published articles cleanly -->
  <div style="display: none;">
    <b:section id='main' showaddelement='yes'>
      <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog' visible='true'>
        <b:includable id='main' var='top'>
          <b:if cond='data:blog.pageType in {"item", "static_page"}'>
            <b:loop values='data:posts' var='post'>
              <div id='blogger-post-data' class='blogger-post-container'>
                <div id='blogger-post-title'><data:post.title/></div>
                <div id='blogger-post-author'><data:post.author/></div>
                <div id='blogger-post-date'><data:post.dateHeader/></div>
                <div id='blogger-post-url'><data:post.url/></div>
                <div id='blogger-post-content'><data:post.body/></div>
              </div>
            </b:loop>
          </b:if>
        </b:includable>
      </b:widget>
    </b:section>
  </div>

  <!-- Load the compiled React JS from GitHub Pages (with cache buster) -->
  <script type="module" crossorigin="anonymous" src="${basePath}/index.js${versionTag}"></script>

</body>
</html>`;
}
