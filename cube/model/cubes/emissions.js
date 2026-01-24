cube(`emissions`, {
  sql_table: `main.emissions`,

  data_source: `default`,

  dimensions: {
    country: {
      sql: `country`,
      type: `string`,
    },

    iso_code: {
      sql: `iso_code`,
      type: `string`,
    },

    year: {
      sql: `year`,
      type: `number`,
    },

    // Keep these as dimensions so you can display raw values on tables/details
    population: {
      sql: `population`,
      type: `number`,
    },

    gdp: {
      sql: `gdp`,
      type: `number`,
    },

    co2_including_luc: {
      sql: `co2_including_luc`,
      type: `number`,
    },

    energy_per_capita: {
      sql: `energy_per_capita`,
      type: `number`,
    },

    primary_energy_consumption: {
      sql: `primary_energy_consumption`,
      type: `number`,
    },
  },

  measures: {
    count: { type: `count` },

    // These are useful measures for charts/aggregations
    co2: {
      sql: `co2`,
      type: `sum`,
    },

    co2_per_capita_avg: {
      sql: `co2_per_capita`,
      type: `avg`,
    },

    // “snapshot-style” measures for when you group by country + filter to latest year
    population_latest: {
      sql: `population`,
      type: `max`,
    },

    gdp_latest: {
      sql: `gdp`,
      type: `max`,
    },
  },
});
