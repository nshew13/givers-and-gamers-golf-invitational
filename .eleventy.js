const { dateFilter } = require('./libs/utilities/NunjucksDateFilter')

const DIR_INTERMEDIATE = 'src';

module.exports = (eleventyConfig) => {
    eleventyConfig.addPassthroughCopy('templates/**/*.css');
    eleventyConfig.addPassthroughCopy('templates/**/*.html');
    eleventyConfig.addPassthroughCopy('templates/**/*.js');
    eleventyConfig.addPassthroughCopy('templates/**/*.scss');
    eleventyConfig.addPassthroughCopy('templates/**/*.ts');

    eleventyConfig.addNunjucksFilter('date', dateFilter);

    return {
        dir: {
            input: 'templates',
            output: DIR_INTERMEDIATE,
        },
        templateFormats: ['njk'],
    };
};
