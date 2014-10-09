define(['lodash', 'src/scenario', 'src/plot'],
function(_,        Scenario,       Plot) {
  var Dialogue = function(text, isCustomer) {
    this.t = text;
    this.c = _.isUndefined(isCustomer) ? true : isCustomer;
  };

  var depositRules = [
    'Checks must be made out to the same name as on the customer account.',
    'Checks must be signed.',
    'Deposit slips must be correctly filled out.'
  ];

  var depositRules2 = depositRules.concat([
    'Checks cannot be postdated.'
  ]);

  var withdrawalRules = [
    'Withdrawal slip is required to be filled out completely.',
    'Withdrawal amount cannot exceed account balance.',
    'Withdrawal slip has to be signed by account holder for cash withdrawals.'
  ];

  var types = [
    'Checking',
    'Savings',
    'MMA'
  ];

  var joshuaSmith = {
    name: 'Joshua Smith',
    picture: 'joshua_smith',
    accounts: [
      {
        number: '6461133',
        type: types[0],
        since: 'May 4, 2011',
        balance: 1089.25
      }
    ]
  };
  var pedroRamirez = {
    name: 'Pedro Ramirez',
    picture: 'pedro_ramirez',
    accounts: [
      {
        number: '7887730',
        type: types[0],
        since: 'July 4, 2011',
        balance: 2654.51
      },
      {
        number: '9451220',
        type: types[1],
        since: 'May 3, 2013',
        balance: 10890.45
      }
    ]
  };
  var jeromeBoyd = {
    name: 'Jerome Boyd',
    picture: 'jerome_boyd',
    accounts: [
      {
        number: '5197871',
        type: types[0],
        since: 'December 6, 2003',
        balance: 4949.68
      },
      {
        number: '8319400',
        type: types[2],
        since: 'December 6, 2003',
        balance: 3800.03
      }
    ]
  };
  var dorisWong = {
    name: 'Doris Wong',
    picture: 'doris_wong',
    accounts: [
      {
        number: '4806423',
        type: types[0],
        since: 'September 18, 2008',
        balance: 1811.72
      },
      {
        number: '2846102',
        type: types[1],
        since: 'September 18, 2008',
        balance: 462.90
      }
    ]
  };
  var mariaGonzalez = {
    name: 'Maria Gonzalez',
    picture: 'maria_gonzalez',
    accounts: [
      {
        number: '5079607',
        type: types[0],
        since: 'April 18, 2011',
        balance: 2709.13
      }
    ]
  };
  var deniseCoombs = {
    name: 'Denise Coombs',
    picture: 'denise_coombs',
    accounts: [
      {
        number: '9530690',
        type: types[0],
        since: 'August 9, 2009',
        balance: 16738.41
      }
    ]
  };
  var barbaraRomero = {
    name: 'Barbara Romero',
    picture: 'barbara_romero',
    accounts: [
      {
        number: '2431212',
        type: types[1],
        since: 'October 30, 1999',
        balance: 4627.29
      }
    ]
  };
  var melvinPatterson = {
    name: 'Melvin Patterson',
    picture: 'melvin_patterson',
    accounts: [
      {
        number: '1983682',
        type: types[1],
        since: 'February 3, 2011',
        balance: 5957.11
      }
    ]
  };
  var patriciaHennessey = {
    name: 'Patricia Hennessey',
    picture: 'patricia_hennessey',
    accounts: [
      {
        number: '8689743',
        type: types[1],
        since: 'September 15, 2012',
        balance: 9726.25
      }
    ]
  };
  var andrewLee = {
    name: 'Andrew Lee',
    picture: 'andrew_lee',
    accounts: [
      {
        number: '1267311',
        type: types[0],
        since: 'January 1, 1990',
        balance: 1516.81
      }
    ]
  };

  var scenarios = [
    new Scenario(
      pedroRamirez,
      [
        new Dialogue("Hi, I'd like to deposit a check."),
        new Dialogue("Sure I can help you with that. You'll need to fill out a deposit slip.", false),
        new Dialogue("I've already done that. Here's the check and the deposit slip."),
        new Dialogue("Thanks! Just a second while I process this.", false)
      ],
      depositRules,
      new Plot({
        'r1:i0signed': {
          gameData: {
            d: [
              new Dialogue("I'm sorry, but this check is not signed.", false),
              new Dialogue("Oh really? I didn't know that. I can get it signed and come back.")
            ]
          }
        }
      }),
      [
        {
          type: 'check',
          data: {
            from: 'Ronald McKenzie',
            date: 'Jan 1, 2014',
            to: 'Pedro Ramirez',
            signed: '',
            amount: 100,
            writtenAmount: 'One hundred and no/100',
            memo: 'Great job!'
          }
        },
        {
          type: 'deposit',
          data: {
            name: 'Pedro Ramirez',
            date: 'Jan 6, 2014',
            account: '7887730',
            cash: 0,
            amount: 100,
            checks: 100,
            subtotal: 100,
            received: 0,
            total: 100
          }
        }
      ],
      'deny'
    ),
    new Scenario(
      joshuaSmith,
      [
        new Dialogue("Hi there! Looks busy today, so I'll make it quick."),
        new Dialogue("I just need to deposit this check."),
        new Dialogue("Sure, no problem.", false),
        new Dialogue("Thanks."),
        new Dialogue("You know, my daughter just started violin classes. They're so expensive!"),
        new Dialogue("I need to get some cash to pay for those classes, but I'll come back for that later.")
      ],
      depositRules,
      new Plot(
         
      ),
      [
        {
          type: 'check',
          data: {
            from: 'Brad Whitman',
            date: 'Jan 4, 2014',
            to: 'Joshua Smith',
            signed: 'B Whitman',
            amount: 250,
            writtenAmount: 'Two hundred and fifty only',
            memo: ''
          }
        },
        {
          type: 'deposit',
          data: {
            name: 'Joshua Smith',
            date: 'Jan 6, 2014',
            account: '6461133',
            cash: 0,
            amount: 250,
            checks: 250,
            subtotal: 250,
            received: 0,
            total: 250
          }
        }
      ],
      'approve'
    ),
    new Scenario(
      jeromeBoyd,
      [
        new Dialogue("Hey. I'm on my lunch break so let's do this fast."),
        new Dialogue("Here's the check and deposit slip."),
        new Dialogue("We'll get you out of here in a second.", false)
      ],
      depositRules,
      new Plot({
        'c0:i0to': {
           gameData: {
              d: [
                new Dialogue("I'm sorry, but this check has a slightly different name than your account.", false),
                new Dialogue("Well, I go by Jerry, like my grandfather did. And my middle name is Grant."),
                new Dialogue("I see...", false)
              ]
           }
        }
      }),
      [
        {
          type: 'check',
          data: {
            from: 'Dropbox Inc',
            date: 'December 12, 2013',
            to: 'Jerry G. Boyd',
            signed: 'D Houston',
            amount: 5450,
            writtenAmount: 'Five thousand, four hundred and fifty',
            memo: 'Paycheck'
          }
        },
        {
          type: 'deposit',
          data: {
            name: 'Jerome Boyd',
            date: 'Jan 6, 2014',
            account: '5197871',
            cash: 0,
            amount: 5450,
            checks: 5450,
            subtotal: 5450,
            received: 0,
            total: 5450
          }
        }
      ],
      'escalate'
    ),
    new Scenario(
      dorisWong,
      [
        new Dialogue("Hello, could I make a withdrawal?")
      ],
      depositRules.concat(withdrawalRules),
      new Plot(
        
      ),
      [
        {
          type: 'withdrawal',
          data: {
            name: 'Doris Wong',
            signed: 'Doris Wong',
            date: 'Jan 6, 2014',
            account: '4806423',
            amount: 650
          }
        }
      ],
      'approve'
    ),
    new Scenario(
      mariaGonzalez,
      [
        new Dialogue("Hi, I also need to make a withdrawal. Just like she did.")
      ],
      depositRules.concat(withdrawalRules),
      new Plot({
        'r3:i0account': {
          gameData: {
            d: [
              new Dialogue("I think your account number is missing here.", false),
              new Dialogue("I actually forgot it. Sorry, I haven't been here in a while."),
              new Dialogue("Could you tell me what it is? My name is spelled out right there."),
              new Dialogue("Sure. But I'll need to see some ID. Do you have your driver's license?", false),
              new Dialogue("Not on me. It's in the car. Do I have to go get it?")
            ]
          }
        }
      }),
      [
        {
          type: 'withdrawal',
          data: {
            name: 'Maria Gonzalez',
            signed: 'M Gonzalez',
            date: 'Jan 6, 2014',
            account: '',
            amount: 50
          }
        }
      ],
      'deny'
    ),
    new Scenario(
      deniseCoombs,
      [
        new Dialogue("Hi. Here's another rent check from my tenant."),
        new Dialogue("You know, it's kind of a pain to come every month just to deposit this check.")
      ],
      depositRules.concat(withdrawalRules),
      new Plot(

      ),
      [
        {
          type: 'check',
          data: {
            from: 'Mindy Green',
            date: 'Jan 1, 2014',
            to: 'Denise Coombs',
            signed: 'M Green',
            amount: 1070.00,
            writtenAmount: 'One thousand and seventy only',
            memo: 'Rent'
          }
        },
        {
          type: 'deposit',
          data: {
            name: 'Denise Coombs',
            date: 'Jan 6, 2014',
            account: '9530690',
            cash: 0,
            amount: 1070,
            checks: 1070,
            subtotal: 1070,
            received: 0,
            total: 1070
          }
        }
      ],
      'approve'
    ),
    new Scenario(
      joshuaSmith,
      [
        new Dialogue("Hi, it's me again!"),
        new Dialogue("I think I'll make that withdrawal now for my daughter's violin classes."),
        new Dialogue("I think I'm low on my balance, but I'd like to do an overdraft."),
        new Dialogue("I'm not sure I can though. Maybe I should talk to your supervisor?")
      ],
      depositRules.concat(withdrawalRules),
      new Plot({
        'i0amount:a0balance': {
          gameData: {
            d: [
              new Dialogue("I'm sorry, but you don't have enough in your account to make this withdrawal.", false),
              new Dialogue("I know! I just told you that! Weren't you paying attention??"),
              new Dialogue("Can I just talk to your manager?")
            ]
          }
        }
      }),
      [
        {
          type: 'withdrawal',
          data: {
            name: 'Joshua Smith',
            signed: 'J Smith',
            date: 'Jan 6, 2014',
            account: '6461133',
            amount: 1200
          }
        }
      ],
      'escalate'
    ),
    new Scenario(
      barbaraRomero,
      [
        new Dialogue("Hi there. I need to get some cash out quickly. I'm buying a car today!")
      ],
      depositRules.concat(withdrawalRules),
      new Plot(

      ),
      [
        {
          type: 'withdrawal',
          data: {
            name: 'Barbara Romero',
            signed: 'B Romero',
            date: 'Jan 6, 2014',
            account: '2431212',
            amount: 3500
          }
        }
      ],
      'approve'
    ),
    new Scenario(
      melvinPatterson,
      [
        new Dialogue("Someone bought my guitar at our garage sale this weekend!"),
        new Dialogue("Now let's just hope this check doesn't bounce...")
      ],
      depositRules2.concat(withdrawalRules),
      new Plot(

      ),
      [
        {
          type: 'check',
          data: {
            from: 'Mark Jones',
            date: 'Jan 1, 2014',
            to: 'Melvin Patterson',
            signed: 'Mark Jones',
            amount: 105.00,
            writtenAmount: 'One hundred and five',
            memo: 'Guitar'
          }
        },
        {
          type: 'deposit',
          data: {
            name: 'Melvin Patterson',
            date: 'Jan 6, 2014',
            account: '1983682',
            cash: 0,
            amount: 105,
            checks: 105,
            subtotal: 105,
            received: 0,
            total: 105
          }
        }
      ],
      'approve'
    ),
    new Scenario(
      joshuaSmith,
      [
        new Dialogue("Ok buddy. I'm back. I spoke to your manager, and I know you have your rules."),
        new Dialogue("So I had a friend of mine help me out with this check."),
        new Dialogue("He banks here too, so it should clear immediately, and then I'll be on my way.")
      ],
      depositRules2.concat(withdrawalRules),
      new Plot({
        'r3:i0date': {
          gameData: {
            d: [
              new Dialogue("I'm very sorry, Mr. Smith. But your friend postdated this check.", false),
              new Dialogue("We can't accept it until tomorrow.", false),
              new Dialogue("Are you serious?? You and your rules!"),
              new Dialogue("Can't you just help a guy out? I don't even want to bank here anymore!")
            ]
          }
        }
      }),
      [
        {
          type: 'check',
          data: {
            from: 'Miguel C.',
            date: 'Jan 7, 2014',
            to: 'Joshua Smith',
            signed: 'M Cabria',
            amount: 300,
            writtenAmount: 'Three Hundred only',
            memo: ''
          }
        },
        {
          type: 'deposit',
          data: {
            name: 'Joshua Smith',
            date: 'Jan 6, 2014',
            account: '6461133',
            cash: 0,
            amount: 300,
            checks: 300,
            subtotal: 300,
            received: 0,
            total: 300
          }
        }
      ],
      'deny'
    ),
    new Scenario(
      patriciaHennessey,
      [
        new Dialogue("What a bad day! I knew I shouldn't even have gotten out of bed this morning."),
        new Dialogue(" Let's just get this deposit done with please.")
      ],
      depositRules2.concat(withdrawalRules),
      new Plot({
        'a0number:i1account': {
          gameData: {
            d: [
              new Dialogue("I'm sorry. Are you sure you wrote the correct account number on the slip?", false),
              new Dialogue("Oh god, do I have to go write a new one now?")
            ]
          }
        }
      }),
      [
        {
          type: 'check',
          data: {
            from: 'Luci Shellack',
            date: 'Jan 4, 2014',
            to: 'Patricia Hennessey',
            signed: 'Luci S',
            amount: 1698,
            writtenAmount: 'Sixteen hundred and ninety-eight',
            memo: ''
          }
        },
        {
          type: 'deposit',
          data: {
            name: 'Patricia Hennessey',
            date: 'Jan 6, 2014',
            account: '8684973',
            cash: 0,
            amount: 1698,
            checks: 1698,
            subtotal: 1698,
            received: 0,
            total: 1698
          }
        }
      ],
      'deny'
    ),
    new Scenario(
      andrewLee,
      [
        new Dialogue("Boy, am I glad I made it before you closed!"),
        new Dialogue("I need to take out a little cash for poker night."),
        new Dialogue("Don't worry. I'll be back tomorrow to deposit the winnings."),
        new Dialogue("Today's my lucky day! I can feel it.")
      ],
      depositRules2.concat(withdrawalRules),
      new Plot({

      }),
      [
        {
          type: 'withdrawal',
          data: {
            name: 'Andrew Lee',
            signed: 'A Lee',
            date: 'Jan 6, 2014',
            account: '1267311',
            amount: 1500
          }
        }
      ],
      'approve'
    )
  ];
  return scenarios;
});
