# web-architecture-101
A series of lessons introducing you to fundamental principles and design patterns of Web Architecture. Brought to you by Markup Tips and Thinkful.

## Getting Started

run bundle install to install the necessary gems

Generate the HTML site from Markdown using

```bash
bundle exec jekyll serve 
```

When publishing to the courses.markup.tips/intro-web-architecture use 

```bash 
bundle exec jekyll serve --config _config.yml,_configprod.yml
```

```bash 
cd web-architecture-101/assets
gem install neat #may need to use sudo 
neat install
```

```bash 
cd _build
yarn # just the once 
gulp ebook && say ebook generated && open ../intro-web-architecture.epub
```

