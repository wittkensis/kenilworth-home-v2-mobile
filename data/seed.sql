PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "asset_categories" (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    icon TEXT  -- emoji or icon name
);
INSERT INTO asset_categories VALUES(1,'HVAC','🌡️');
INSERT INTO asset_categories VALUES(2,'Plumbing','🚿');
INSERT INTO asset_categories VALUES(3,'Electrical','⚡');
INSERT INTO asset_categories VALUES(4,'Kitchen','🍳');
INSERT INTO asset_categories VALUES(5,'Laundry','👕');
INSERT INTO asset_categories VALUES(6,'Entertainment','📺');
INSERT INTO asset_categories VALUES(7,'Outdoor','🌳');
INSERT INTO asset_categories VALUES(8,'Safety','🔒');
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    trade TEXT,  -- "plumber", "electrician", "HVAC", "general", etc.
    phone TEXT,
    email TEXT,
    website TEXT,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    notes TEXT,
    last_used_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
, is_favorite INTEGER DEFAULT 0);
INSERT INTO contacts VALUES(5,'Pancho''s Lawn Maintenance',NULL,'landscaping','(630) 244-8429',NULL,NULL,NULL,'Jose who took over for Efrain
Not sure if theyâre still active',NULL,'2026-01-05 16:22:44',0);
INSERT INTO contacts VALUES(9,'Felix Lopez',NULL,'plumber','816-724-5216','lopezfelix@gmail.com',NULL,NULL,NULL,NULL,'2026-01-05 16:22:44',0);
INSERT INTO contacts VALUES(11,'Custom Edge Sharpening',NULL,'specialty','630-474-1023','grant@customedgesharpenting.com','http://customedgesharpening.com',NULL,'Grant Lauinger',NULL,'2026-01-05 16:22:44',0);
INSERT INTO contacts VALUES(12,'Naperville Carpet Cleaning',NULL,'cleaning','6309041919',NULL,'www.mynapervillecarpetcleaning.com',NULL,'🚨 Rick (main owner). Rick''s Cell: 630-461-9460',NULL,'2026-01-05 16:22:44',0);
INSERT INTO contacts VALUES(14,'BR Cevaal Insurance',NULL,'insurance','630-442-7910',NULL,'https://www.brcevaal.com/',NULL,'Bill',NULL,'2026-01-05 16:22:44',0);
INSERT INTO contacts VALUES(15,'AAA',NULL,'insurance','630-588-7060 ext. 209','sbbecket@acg.aaa.com',NULL,NULL,'Sue Becket (Member Representative)',NULL,'2026-01-05 16:22:44',0);
INSERT INTO contacts VALUES(17,'CWF Restoration',NULL,'restoration','(708) 603-1232',NULL,NULL,NULL,'🚨 Grace Galletta (Account Manager). Grace''s Cell: (708) 603-1232, 24/7 emergency: (630) 829-9000',NULL,'2026-01-05 16:22:44',0);
INSERT INTO contacts VALUES(18,'ABC Heating & Cooling',NULL,NULL,'888-476-1080',NULL,'www.4abc.com',NULL,'Plumbing â Chris Rojek
HVAC â Deon Hambrick',NULL,'2026-01-05 16:22:44',1);
INSERT INTO contacts VALUES(19,'Invisible Fence',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 18:40:29',0);
INSERT INTO contacts VALUES(20,'Abt',NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,'2026-01-24 03:37:29',1);
INSERT INTO contacts VALUES(21,'Yosimar Cruz','Y&C Pro Painting Services','maintenance','(331) 454-4065','yosimar.cruz1989@gmail.com',NULL,NULL,'Recommended by the McFarlands',NULL,'2026-01-28 20:25:18',1);
INSERT INTO contacts VALUES(22,'Frank Zarate',NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,'2026-01-29 04:42:45',1);
INSERT INTO contacts VALUES(23,'[Wallpaper Guys]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-29 04:58:04',0);
INSERT INTO contacts VALUES(24,'Big Joe''s Sealcoating',NULL,NULL,NULL,'adam@bigjoessealcoating.com',NULL,5,NULL,NULL,'2026-01-30 03:48:03',0);
INSERT INTO contacts VALUES(25,'BDK Garage Door',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-30 03:59:15',0);
INSERT INTO contacts VALUES(26,'[Tesla Electrician]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-30 04:05:18',0);
INSERT INTO contacts VALUES(27,'Luxury Landscaping',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-30 04:08:29',0);
INSERT INTO contacts VALUES(28,'Andy Hernandez',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-30 04:20:16',0);
INSERT INTO contacts VALUES(29,'Mike','Lexim Group',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-30 04:20:46',0);
CREATE TABLE area_groups (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    collapsed INTEGER DEFAULT 0
);
INSERT INTO area_groups VALUES(1,'First Floor',1,0);
INSERT INTO area_groups VALUES(2,'Second Floor',2,0);
INSERT INTO area_groups VALUES(3,'Attic',3,1);
INSERT INTO area_groups VALUES(4,'Basement',4,0);
INSERT INTO area_groups VALUES(5,'Garage',5,0);
INSERT INTO area_groups VALUES(6,'Outside',6,0);
INSERT INTO area_groups VALUES(7,'General',7,1);
CREATE TABLE schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
INSERT INTO schema_migrations VALUES(1,'2026-01-22 17:10:18');
INSERT INTO schema_migrations VALUES(2,'2026-01-22 17:10:18');
INSERT INTO schema_migrations VALUES(3,'2026-01-22 17:10:18');
INSERT INTO schema_migrations VALUES(4,'2026-01-22 18:01:43');
INSERT INTO schema_migrations VALUES(5,'2026-01-22 18:13:10');
INSERT INTO schema_migrations VALUES(6,'2026-01-22 18:38:23');
INSERT INTO schema_migrations VALUES(7,'2026-01-22 19:04:56');
INSERT INTO schema_migrations VALUES(8,'2026-01-24 02:34:34');
INSERT INTO schema_migrations VALUES(9,'2026-01-24 21:50:27');
INSERT INTO schema_migrations VALUES(10,'2026-01-24 22:20:57');
INSERT INTO schema_migrations VALUES(11,'2026-01-25 05:47:25');
INSERT INTO schema_migrations VALUES(12,'2026-01-25 19:28:26');
INSERT INTO schema_migrations VALUES(13,'2026-01-26 03:22:23');
CREATE TABLE settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
CREATE TABLE contact_tags (
      contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
      tag TEXT NOT NULL,
      PRIMARY KEY (contact_id, tag)
    );
INSERT INTO contact_tags VALUES(19,'Maintenance');
INSERT INTO contact_tags VALUES(19,'Landscaping');
INSERT INTO contact_tags VALUES(20,'Maintenance');
INSERT INTO contact_tags VALUES(21,'Maintenance');
INSERT INTO contact_tags VALUES(22,'Carpentry');
INSERT INTO contact_tags VALUES(18,'Maintenance');
CREATE TABLE IF NOT EXISTS "assets" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER REFERENCES asset_categories(id),
      area_group_id INTEGER REFERENCES area_groups(id),
      area_item_id INTEGER REFERENCES area_items(id),
      brand TEXT,
      model TEXT,
      purchase_date TEXT,
      warranty_expires TEXT,
      manual_url TEXT,
      notes TEXT,
      omnifocus_task_id TEXT
    );
INSERT INTO assets VALUES(1,'Kitchen Fridge',NULL,NULL,1,'Viking',NULL,'2024-08-13','2030-08-13',NULL,'Installed by Abt. 4 year extended warranty purchased through Abt. 22.x cu ft. Expected 20 year lifespan',NULL);
INSERT INTO assets VALUES(2,'Garage Fridge',NULL,NULL,17,'GE','GTS22KYNRFS','2025-02-12',NULL,NULL,'Installed by Abt. 4 year extended warranty purchased through Abt. 19.x cu ft. Expected 20 year lifespan',NULL);
INSERT INTO assets VALUES(4,'Water Heater',2,NULL,14,'Navien','NPE-240A2','2003-01-01',NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(5,'Garage Door',NULL,NULL,17,'C.H.I.','5300','2025-12-02',NULL,NULL,'CHI 5300 - Custom Overlay Door - MATERIAL ONLY
Panel Style: Overlay
Section Construction: 2-1/2â Thick - 2-Sided Steel
Section Material: Medium Duty / 27 Ga. Steel
Insulation Type: 1-13/16" Polystyrene
Thermal Performance (R-value): 10.29

Size: 16x8
Panel Design: 33A
Color: White
Track: 15"R',NULL);
INSERT INTO assets VALUES(6,'Dishwasher',NULL,NULL,1,'KitchenAid',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(7,'Mini Fridge',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(8,'Oven',NULL,NULL,1,'GE','Profile Performance',NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(9,'Microwave',NULL,NULL,1,'GE','PEM31SFSS',NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(10,'Sink',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(11,'Sink Faucet',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(12,'Stove',NULL,NULL,1,'Bosch',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(13,'HVAC',NULL,NULL,29,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(14,'HVAC',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(15,'Garage Heater',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(16,'Lamp Post (Front)',NULL,NULL,19,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(17,'Lamp Post (Back)',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(18,'Invisible Dog Fence',NULL,6,NULL,'InvisibleFence',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(20,'Toilet',NULL,NULL,24,'American Standard',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(21,'Sink',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(22,'Lights',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(23,'Toilet',NULL,NULL,10,'TOTO','ULTRAMAX 1 PIECE',NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(24,'Left Sink',NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(25,'Right Sink',NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(26,'Bathtub',NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(27,'Sink',NULL,NULL,25,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(28,'Clothes Washer',NULL,NULL,25,'Electrolux','ELFW7637AW','2025-03-08','2030-03-08',NULL,NULL,NULL);
INSERT INTO assets VALUES(29,'Clothes Dryer',NULL,NULL,25,'Electrolux ',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(30,'Left Sink',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(31,'Right Sink',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(32,'Jacuzzi',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(33,'Shower',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(34,'Toilet',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(35,'Shower',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(36,'Toilet',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(37,'Sink',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(38,'Sump Pump',NULL,NULL,27,'Commander',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(39,'Ejector Pump',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(40,'Sump Pump (Bar)',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(41,'Deep Freezer',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(42,'Fireplace',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(44,'Roof',NULL,6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(45,'Chimney Stack',NULL,6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(46,'Electric Car Charger',NULL,NULL,17,'Tesla',NULL,'2021-05-01',NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(47,'Front Porch',NULL,NULL,19,'Trex',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(48,'Fume Hood ($1,495.88 total)',NULL,NULL,1,'Best','EPR634SS',NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(49,'Wine Cooler',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(50,'Sink',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(52,'TV',NULL,NULL,3,'Samsung','QN65QN85DAF',NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(53,'TV',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(54,'Back Porch',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(55,'Front Door',NULL,NULL,19,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(56,'Microwave',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(57,'Food Warmer',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(58,'Pump Backup Battery',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(59,'TV',6,NULL,26,'LG',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(60,'Garage Door Motor',NULL,NULL,17,NULL,NULL,'2025-12-02',NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(61,'HVAC Humidifier',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(62,'Driveway',NULL,6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(63,'Back Door',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(64,'Ficus Tree',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(65,'Grill',NULL,NULL,20,'Traeger',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(66,'Car',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(67,'Car',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(68,'Lilac Bushes',NULL,NULL,21,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(69,'Lilac Tree',NULL,NULL,19,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO assets VALUES(70,'Backup Sump Pump',NULL,NULL,27,'???','???',NULL,NULL,NULL,NULL,NULL);
CREATE TABLE IF NOT EXISTS "area_items" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER REFERENCES area_groups(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      category_id INTEGER REFERENCES asset_categories(id),
      sort_order INTEGER DEFAULT 0
    );
INSERT INTO area_items VALUES(1,1,'Kitchen',NULL,1);
INSERT INTO area_items VALUES(2,1,'Mudroom',NULL,2);
INSERT INTO area_items VALUES(3,1,'Living Room',NULL,3);
INSERT INTO area_items VALUES(4,1,'Library',NULL,4);
INSERT INTO area_items VALUES(5,1,'Dining Room',NULL,5);
INSERT INTO area_items VALUES(6,1,'Breakfast Nook',NULL,6);
INSERT INTO area_items VALUES(7,2,'Shaan''s Room',NULL,1);
INSERT INTO area_items VALUES(8,2,'Ellora''s Room',NULL,2);
INSERT INTO area_items VALUES(9,2,'Guest Room',NULL,3);
INSERT INTO area_items VALUES(10,2,'Shared Bathroom',NULL,4);
INSERT INTO area_items VALUES(11,2,'Master Bathroom',NULL,5);
INSERT INTO area_items VALUES(12,2,'Master Bedroom',NULL,6);
INSERT INTO area_items VALUES(13,3,'Office',NULL,1);
INSERT INTO area_items VALUES(14,4,'Art Studio',NULL,1);
INSERT INTO area_items VALUES(15,4,'Stairwell',NULL,2);
INSERT INTO area_items VALUES(16,5,'Sun Room',NULL,1);
INSERT INTO area_items VALUES(17,5,'Parking Area',NULL,2);
INSERT INTO area_items VALUES(18,5,'Attic',NULL,3);
INSERT INTO area_items VALUES(19,6,'Front Yard',NULL,1);
INSERT INTO area_items VALUES(20,6,'Back Yard',NULL,2);
INSERT INTO area_items VALUES(21,6,'South Side',NULL,3);
INSERT INTO area_items VALUES(22,6,'Driveway',NULL,4);
INSERT INTO area_items VALUES(23,7,'Stairwell',NULL,1);
INSERT INTO area_items VALUES(24,1,'Powder Room',NULL,7);
INSERT INTO area_items VALUES(25,2,'Laundry Room',NULL,7);
INSERT INTO area_items VALUES(26,4,'Main Area',NULL,3);
INSERT INTO area_items VALUES(27,4,'Utility Room',NULL,4);
INSERT INTO area_items VALUES(28,4,'Bathroom',NULL,5);
INSERT INTO area_items VALUES(29,3,'HVAC Closet',NULL,2);
CREATE TABLE IF NOT EXISTS "paint_swatches" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      area_item_id INTEGER REFERENCES area_items(id),
      color_name TEXT NOT NULL,
      color_code TEXT,
      base TEXT,
      sheen TEXT CHECK(sheen IN ('flat','matte','eggshell','satin','semi-gloss','gloss')),
      provider TEXT,
      store TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    , preview_color TEXT);
INSERT INTO paint_swatches VALUES(1,NULL,'Revere Pewter',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-31 00:20:37',NULL);
CREATE TABLE maintenance_assets (
    task_id INTEGER NOT NULL REFERENCES maintenance_tasks(id) ON DELETE CASCADE,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, asset_id)
);
INSERT INTO maintenance_assets VALUES(4,14);
INSERT INTO maintenance_assets VALUES(5,14);
INSERT INTO maintenance_assets VALUES(6,62);
INSERT INTO maintenance_assets VALUES(19,45);
INSERT INTO maintenance_assets VALUES(18,42);
INSERT INTO maintenance_assets VALUES(15,1);
INSERT INTO maintenance_assets VALUES(14,1);
INSERT INTO maintenance_assets VALUES(13,1);
INSERT INTO maintenance_assets VALUES(17,42);
INSERT INTO maintenance_assets VALUES(3,13);
INSERT INTO maintenance_assets VALUES(3,14);
INSERT INTO maintenance_assets VALUES(3,61);
INSERT INTO maintenance_assets VALUES(7,64);
INSERT INTO maintenance_assets VALUES(22,68);
INSERT INTO maintenance_assets VALUES(22,69);
INSERT INTO maintenance_assets VALUES(11,67);
INSERT INTO maintenance_assets VALUES(12,67);
INSERT INTO maintenance_assets VALUES(23,55);
INSERT INTO maintenance_assets VALUES(24,18);
INSERT INTO maintenance_assets VALUES(20,5);
INSERT INTO maintenance_assets VALUES(20,60);
INSERT INTO maintenance_assets VALUES(2,13);
INSERT INTO maintenance_assets VALUES(2,14);
INSERT INTO maintenance_assets VALUES(2,61);
INSERT INTO maintenance_assets VALUES(25,63);
INSERT INTO maintenance_assets VALUES(27,1);
INSERT INTO maintenance_assets VALUES(27,27);
INSERT INTO maintenance_assets VALUES(27,50);
INSERT INTO maintenance_assets VALUES(28,4);
INSERT INTO maintenance_assets VALUES(31,70);
INSERT INTO maintenance_assets VALUES(32,38);
INSERT INTO maintenance_assets VALUES(33,38);
CREATE TABLE maintenance_contacts (
    task_id INTEGER NOT NULL REFERENCES maintenance_tasks(id) ON DELETE CASCADE,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, contact_id)
);
INSERT INTO maintenance_contacts VALUES(4,21);
INSERT INTO maintenance_contacts VALUES(6,24);
INSERT INTO maintenance_contacts VALUES(1,27);
INSERT INTO maintenance_contacts VALUES(8,27);
INSERT INTO maintenance_contacts VALUES(16,21);
INSERT INTO maintenance_contacts VALUES(17,21);
CREATE TABLE IF NOT EXISTS "maintenance_tasks" (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    frequency_days INTEGER NOT NULL,
    frequency_label TEXT,
    estimated_minutes INTEGER,
    omnifocus_task_id TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO maintenance_tasks VALUES(1,'Winter Landscaping Cleanup',365,'Annual (November)',NULL,NULL,NULL,'2026-01-30 02:41:53');
INSERT INTO maintenance_tasks VALUES(2,'Winter HVAC Maintenance',365,'Annual (November)',NULL,'omnifocus:///task/bZWWCIZmxxA',NULL,'2026-01-27 04:18:35');
INSERT INTO maintenance_tasks VALUES(3,'Spring Maintenance',365,'Annual (April)',NULL,'omnifocus:///task/nR3xwuCY8ZU',NULL,'2026-01-27 04:19:16');
INSERT INTO maintenance_tasks VALUES(6,'Sealcoating',365,'Annual (May)',NULL,'omnifocus:///task/cNzMBFGuFva',NULL,'2026-01-27 04:22:29');
INSERT INTO maintenance_tasks VALUES(7,'Prune Ficus',365,'Annual (April)',NULL,NULL,NULL,'2026-01-30 04:12:13');
INSERT INTO maintenance_tasks VALUES(8,'Spring Landscaping',365,'Annual (April)',NULL,NULL,NULL,'2026-01-30 04:12:49');
INSERT INTO maintenance_tasks VALUES(11,'Spring Oil Change',365,'Annual (April)',NULL,NULL,NULL,'2026-01-30 04:14:39');
INSERT INTO maintenance_tasks VALUES(12,'Winter Oil Change',365,'Annual (November)',NULL,NULL,NULL,'2026-01-30 04:14:57');
INSERT INTO maintenance_tasks VALUES(13,'Fix Fridge Door',0,'One-Time',NULL,NULL,NULL,'2026-01-30 04:16:47');
INSERT INTO maintenance_tasks VALUES(14,'Fix Fridge Freezer Door',0,'One-Time',NULL,NULL,NULL,'2026-01-30 04:16:57');
INSERT INTO maintenance_tasks VALUES(15,'Fix Fridge Water Dispenser',0,'One-Time',NULL,NULL,NULL,'2026-01-30 04:17:05');
INSERT INTO maintenance_tasks VALUES(16,'Fix Ellora’s Window',0,'One-Time',NULL,NULL,NULL,'2026-01-30 04:17:17');
INSERT INTO maintenance_tasks VALUES(17,'Fix Fireplace Air Leak',0,'One-Time',NULL,NULL,NULL,'2026-01-30 04:17:24');
INSERT INTO maintenance_tasks VALUES(18,'Fix Fireplace Carbon Monoxide Leak',0,'One-Time',NULL,NULL,NULL,'2026-01-30 04:17:38');
INSERT INTO maintenance_tasks VALUES(19,'Fix Chimney Stack',0,'One-Time',NULL,NULL,NULL,'2026-01-30 04:18:03');
INSERT INTO maintenance_tasks VALUES(20,'Garage Door Tuning',365,'Annual (September)',NULL,NULL,NULL,'2026-01-30 04:48:10');
INSERT INTO maintenance_tasks VALUES(21,'[Placeholder – all ABC HVAC ad-hoc visits]',0,'One-Time',NULL,NULL,NULL,'2026-01-30 05:03:35');
INSERT INTO maintenance_tasks VALUES(22,'Trim Lilacs',365,'Annual (September)',NULL,NULL,NULL,'2026-01-30 05:29:40');
INSERT INTO maintenance_tasks VALUES(23,'Replace Front Door Lock Batteries',90,'Quarterly (Jan, Apr, Jul, Oct)',NULL,NULL,NULL,'2026-01-30 15:52:35');
INSERT INTO maintenance_tasks VALUES(24,'Replace Collar Battery',90,'Quarterly (Jan, Apr, Jul, Oct)',NULL,NULL,NULL,'2026-01-30 21:31:16');
INSERT INTO maintenance_tasks VALUES(25,'Replace Door Batteries',365,'Annual (January)',NULL,NULL,NULL,'2026-01-30 21:32:33');
INSERT INTO maintenance_tasks VALUES(26,'Replace Fire Extinguishers',365,'Annual (January)',NULL,NULL,NULL,'2026-01-31 00:43:09');
INSERT INTO maintenance_tasks VALUES(27,'Replace Water Filters',365,'Annual (February)',NULL,NULL,NULL,'2026-02-01 02:17:45');
INSERT INTO maintenance_tasks VALUES(28,'Water Heater Maintenance',365,'Annual (February)',NULL,NULL,NULL,'2026-03-02 05:51:54');
INSERT INTO maintenance_tasks VALUES(29,'Replace Gas Pipes',0,'One-Time',NULL,NULL,'Changed from 1” to 1.25” in the utility room','2026-03-02 05:53:07');
INSERT INTO maintenance_tasks VALUES(30,'Upgrade Gas Meter',0,'One-Time',NULL,NULL,'Upgraded to account for new gas piping and new water heater requirements; was undersized for the type of house we have anyway.','2026-03-02 05:53:56');
INSERT INTO maintenance_tasks VALUES(31,'Test Backup Sump Pump',30,'Monthly',NULL,NULL,'Long press the button until it says “REL:” and you hear a sound','2026-03-16 17:17:02');
INSERT INTO maintenance_tasks VALUES(32,'Sump Pump Failure Assessment',0,'One-Time',NULL,NULL,'Basement almost flooded; diagnosed backup pump was working. Battery needs to be replaced now and every 2 years.','2026-03-16 17:18:31');
INSERT INTO maintenance_tasks VALUES(33,'Replace Sump Pump',0,'One-Time',NULL,NULL,NULL,'2026-03-16 17:18:51');
CREATE TABLE upgrades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK(category IN ('repair', 'upgrade', 'cosmetic', 'safety', 'other')),
    priority TEXT CHECK(priority IN ('urgent', 'high', 'medium', 'low', 'someday')) DEFAULT 'medium',
    phase TEXT CHECK(phase IN ('idea', 'planning', 'in_progress', 'completed', 'cancelled')) DEFAULT 'idea',
    estimated_cost_low DECIMAL(10,2),
    estimated_cost_high DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    target_date DATE,
    started_date DATE,
    completed_date DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
, savings_project_id INTEGER);
INSERT INTO upgrades VALUES(1,'Replace Water Heaters',NULL,NULL,'medium','completed',10000,11000,15000,'2026-02-20',NULL,NULL,'Navien NPE-240A2
https://www.navieninc.com/products/npe-240a2','2026-01-22 17:25:53','2026-03-02 05:50:46',NULL);
INSERT INTO upgrades VALUES(2,'Remodel Mudroom',NULL,NULL,'medium','idea',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.pinterest.com/privaswani/house/mudroom/','2026-01-24 02:52:39','2026-01-31 00:05:27',NULL);
INSERT INTO upgrades VALUES(3,'Remodel Master Bathroom',NULL,NULL,'medium','idea',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.pinterest.com/privaswani/house/master-bath/','2026-01-24 02:52:56','2026-01-31 00:05:42',NULL);
INSERT INTO upgrades VALUES(4,'Floor Remodel',NULL,NULL,'medium','completed',NULL,NULL,NULL,'2021-03-31',NULL,NULL,NULL,'2026-01-24 02:54:22','2026-01-24 02:54:22',NULL);
INSERT INTO upgrades VALUES(8,'Remodel Shared Bathroom',NULL,NULL,'medium','idea',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 02:57:36','2026-01-24 03:36:37',NULL);
INSERT INTO upgrades VALUES(9,'Paint Guest Room / Priya’s Office',NULL,NULL,'medium','completed',NULL,NULL,NULL,'2022-01-01',NULL,NULL,'https://www.pinterest.com/privaswani/house/priyas-office/','2026-01-24 02:58:11','2026-01-31 00:18:42',NULL);
INSERT INTO upgrades VALUES(10,'Shaan’s Wallpaper',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 02:58:35','2026-01-24 02:58:35',NULL);
INSERT INTO upgrades VALUES(11,'Paint Kitchen Cabinets',NULL,NULL,'medium','completed',NULL,NULL,NULL,'2021-03-31',NULL,NULL,'https://www.pinterest.com/privaswani/house/kitchen/','2026-01-24 02:59:37','2026-01-31 00:08:13',NULL);
INSERT INTO upgrades VALUES(12,'Replace HVAC',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 03:00:14','2026-01-31 00:04:13',NULL);
INSERT INTO upgrades VALUES(13,'Replace Fireplace Kit',NULL,NULL,'medium','idea',1000,2000,NULL,NULL,NULL,NULL,NULL,'2026-01-24 03:25:40','2026-01-30 05:05:25',NULL);
INSERT INTO upgrades VALUES(15,'Replace Garage Door',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 03:28:12','2026-01-30 03:59:32',NULL);
INSERT INTO upgrades VALUES(16,'Replace Dishwasher',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 03:30:59','2026-01-31 00:07:09',NULL);
INSERT INTO upgrades VALUES(17,'Replace Front Porch',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 03:31:47','2026-01-29 04:48:42',NULL);
INSERT INTO upgrades VALUES(18,'Replace Laundry Room Sink and Counter',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 03:32:08','2026-01-31 00:14:17',NULL);
INSERT INTO upgrades VALUES(19,'Replace Washer & Dryer',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 03:32:23','2026-01-30 04:01:46',NULL);
INSERT INTO upgrades VALUES(20,'Replace Roof',NULL,NULL,'medium','idea',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 03:33:23','2026-01-24 03:37:01',NULL);
INSERT INTO upgrades VALUES(21,'Paint House Exterior',NULL,NULL,'medium','idea',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 03:33:34','2026-01-24 03:33:34',NULL);
INSERT INTO upgrades VALUES(22,'Wallpaper Powder Room',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 03:34:06','2026-01-24 03:34:06',NULL);
INSERT INTO upgrades VALUES(23,'Replace Powder Room Toilet',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 03:34:28','2026-01-31 00:06:42',NULL);
INSERT INTO upgrades VALUES(26,'Replace Fume Hood',NULL,NULL,'medium','completed',NULL,NULL,1495.880000000000109,'2024-01-01',NULL,NULL,NULL,'2026-01-24 03:41:42','2026-01-31 00:10:51',NULL);
INSERT INTO upgrades VALUES(27,'Replace Microwave',NULL,NULL,'medium','completed',NULL,NULL,NULL,'2025-01-01',NULL,NULL,NULL,'2026-01-24 03:42:30','2026-01-25 05:52:41',NULL);
INSERT INTO upgrades VALUES(28,'Vegetable Garden Upgrade',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-24 19:27:23','2026-01-24 19:27:33',NULL);
INSERT INTO upgrades VALUES(29,'Sauna',NULL,NULL,'medium','planning',2500,6000,NULL,'2026-12-31',NULL,NULL,'35âx42â closet OR replacing the water heaters (~4x4 sq ft).

Dynamic Serena Elite from Costco (46"Ã40âx75â)','2026-01-29 03:25:00','2026-03-02 05:50:55',NULL);
INSERT INTO upgrades VALUES(34,'Replace Sump Pump (Whole House)',NULL,NULL,'medium','completed',NULL,NULL,3345,NULL,NULL,NULL,'Actual cost was something along these lines','2026-01-05 16:22:44','2026-02-03 02:20:03',NULL);
INSERT INTO upgrades VALUES(36,'Replace Ejector Pump & Battery',NULL,NULL,'medium','completed',NULL,NULL,3000,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-31 00:16:21',NULL);
INSERT INTO upgrades VALUES(44,'Refinish Floors',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-30 04:23:34',NULL);
INSERT INTO upgrades VALUES(45,'Install Supercharger',NULL,NULL,'medium','completed',NULL,NULL,500,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-30 05:08:17',NULL);
INSERT INTO upgrades VALUES(46,'Paint Fireplace',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-30 04:21:40',NULL);
INSERT INTO upgrades VALUES(50,'New Attic Entry Panel',NULL,NULL,'medium','idea',NULL,NULL,30,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-30 05:04:40',NULL);
INSERT INTO upgrades VALUES(51,'Refinish Master Bedroom',NULL,NULL,'medium','idea',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.pinterest.com/privaswani/house/master-bedroom/','2026-01-05 16:22:44','2026-01-30 05:04:59',NULL);
INSERT INTO upgrades VALUES(53,'Replace Front Yard Shrubs',NULL,NULL,'medium','completed',NULL,NULL,350,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-31 00:17:59',NULL);
INSERT INTO upgrades VALUES(54,'Build Scaffold Over Garbage Bins',NULL,NULL,'medium','completed',NULL,NULL,300,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-05 16:22:44',NULL);
INSERT INTO upgrades VALUES(55,'Refinish Dining Room',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-30 04:03:15',NULL);
INSERT INTO upgrades VALUES(57,'Paint Living Room / Library',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.pinterest.com/privaswani/house/living-room/','2026-01-05 16:22:44','2026-01-30 04:22:11',NULL);
INSERT INTO upgrades VALUES(58,'Improved Basement Crawlspace',NULL,NULL,'medium','in_progress',50,300,NULL,NULL,NULL,NULL,'Test','2026-01-05 16:22:44','2026-02-03 02:40:57',NULL);
INSERT INTO upgrades VALUES(60,'Replace Back Porch Railing',NULL,NULL,'high','planning',3000,6000,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-02-03 02:40:46',NULL);
INSERT INTO upgrades VALUES(62,'Replace basement TV',NULL,NULL,'low','idea',3000,NULL,NULL,NULL,NULL,NULL,'Options: https://gemini.google.com/share/5a0ceff38fe8','2026-01-05 16:22:44','2026-01-30 05:11:00',NULL);
INSERT INTO upgrades VALUES(63,'Replace master bed with King size',NULL,NULL,'medium','idea',3000,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-30 05:11:04',NULL);
INSERT INTO upgrades VALUES(64,'Replace Kitchen Faucet',NULL,NULL,'medium','planning',500,800,NULL,NULL,NULL,NULL,'Options: https://gemini.google.com/share/ef72584a3ec2','2026-01-05 16:22:44','2026-02-03 02:40:27',NULL);
INSERT INTO upgrades VALUES(65,'Repair water damage on ground floor ceilings',NULL,NULL,'medium','idea',1000,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-30 05:11:27',NULL);
INSERT INTO upgrades VALUES(67,'Improved Attic Ventilation','Advice from Bryan H: Whole house fan or attic exhaust fan - Block off vents - Install fan - Open vents on bedroom floor - Mini AC',NULL,'low','idea',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-30 05:05:08',NULL);
INSERT INTO upgrades VALUES(68,'Replace sink and toilet valves',NULL,NULL,'low','idea',5000,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-30 05:11:20',NULL);
INSERT INTO upgrades VALUES(70,'Finish Basement Storage room',NULL,NULL,'low','in_progress',300,600,NULL,NULL,NULL,NULL,'Need to paint remaining walls','2026-01-05 16:22:44','2026-02-03 02:40:35',NULL);
INSERT INTO upgrades VALUES(71,'Replace Shared Bathroom Toilet',NULL,NULL,'medium','completed',1000,NULL,2000,NULL,NULL,NULL,'1100 toilet + 900 toilet install','2026-01-05 16:22:44','2026-02-03 02:23:28',NULL);
INSERT INTO upgrades VALUES(74,'Replace Kitchen Fridge',NULL,NULL,'high','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-31 00:07:50',NULL);
INSERT INTO upgrades VALUES(75,'Replace Garage Fridge',NULL,NULL,'high','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-31 00:11:25',NULL);
INSERT INTO upgrades VALUES(80,'Replace Sump Pump (Bar)',NULL,NULL,'high','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-02-03 02:37:24',NULL);
INSERT INTO upgrades VALUES(82,'Fix chimneytop',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-05 16:22:44',NULL);
INSERT INTO upgrades VALUES(88,'Remove Mulch from Backyard',NULL,NULL,'low','completed',600,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-31 00:21:37',NULL);
INSERT INTO upgrades VALUES(91,'Paint Basement',NULL,NULL,'low','completed',NULL,NULL,NULL,NULL,NULL,NULL,'https://www.pinterest.com/privaswani/house/basement/','2026-01-05 16:22:44','2026-01-31 00:20:13',NULL);
INSERT INTO upgrades VALUES(95,'Paint Attic Office',NULL,NULL,'low','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-31 00:20:51',NULL);
INSERT INTO upgrades VALUES(104,'Basement Crawlspace Entry','Test',NULL,'low','completed',50,NULL,20,NULL,NULL,NULL,NULL,'2026-01-05 16:22:44','2026-01-05 16:22:44',NULL);
INSERT INTO upgrades VALUES(105,'Replace Ejector Pump',NULL,NULL,'medium','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-03 02:29:23','2026-02-03 02:29:23',NULL);
CREATE TABLE upgrade_assets (
    upgrade_id INTEGER NOT NULL REFERENCES upgrades(id) ON DELETE CASCADE,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    PRIMARY KEY (upgrade_id, asset_id)
);
INSERT INTO upgrade_assets VALUES(27,9);
INSERT INTO upgrade_assets VALUES(17,47);
INSERT INTO upgrade_assets VALUES(19,28);
INSERT INTO upgrade_assets VALUES(19,29);
INSERT INTO upgrade_assets VALUES(13,42);
INSERT INTO upgrade_assets VALUES(12,13);
INSERT INTO upgrade_assets VALUES(12,14);
INSERT INTO upgrade_assets VALUES(12,61);
INSERT INTO upgrade_assets VALUES(23,20);
INSERT INTO upgrade_assets VALUES(16,6);
INSERT INTO upgrade_assets VALUES(74,1);
INSERT INTO upgrade_assets VALUES(26,48);
INSERT INTO upgrade_assets VALUES(75,2);
INSERT INTO upgrade_assets VALUES(18,27);
INSERT INTO upgrade_assets VALUES(36,39);
INSERT INTO upgrade_assets VALUES(34,38);
INSERT INTO upgrade_assets VALUES(71,23);
INSERT INTO upgrade_assets VALUES(105,39);
INSERT INTO upgrade_assets VALUES(80,40);
INSERT INTO upgrade_assets VALUES(1,4);
CREATE TABLE upgrade_paints (
    upgrade_id INTEGER NOT NULL REFERENCES upgrades(id) ON DELETE CASCADE,
    paint_id INTEGER NOT NULL REFERENCES paint_swatches(id) ON DELETE CASCADE,
    PRIMARY KEY (upgrade_id, paint_id)
);
INSERT INTO upgrade_paints VALUES(95,1);
CREATE TABLE upgrade_contacts (
    upgrade_id INTEGER NOT NULL REFERENCES upgrades(id) ON DELETE CASCADE,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    role TEXT,
    PRIMARY KEY (upgrade_id, contact_id)
);
INSERT INTO upgrade_contacts VALUES(27,20,NULL);
INSERT INTO upgrade_contacts VALUES(17,22,NULL);
INSERT INTO upgrade_contacts VALUES(15,25,NULL);
INSERT INTO upgrade_contacts VALUES(19,20,NULL);
INSERT INTO upgrade_contacts VALUES(46,29,NULL);
INSERT INTO upgrade_contacts VALUES(57,29,NULL);
INSERT INTO upgrade_contacts VALUES(44,28,NULL);
INSERT INTO upgrade_contacts VALUES(45,26,NULL);
INSERT INTO upgrade_contacts VALUES(16,20,NULL);
INSERT INTO upgrade_contacts VALUES(74,20,NULL);
INSERT INTO upgrade_contacts VALUES(11,29,NULL);
INSERT INTO upgrade_contacts VALUES(26,20,NULL);
INSERT INTO upgrade_contacts VALUES(18,29,NULL);
INSERT INTO upgrade_contacts VALUES(18,28,NULL);
INSERT INTO upgrade_contacts VALUES(36,18,NULL);
INSERT INTO upgrade_contacts VALUES(12,18,NULL);
INSERT INTO upgrade_contacts VALUES(80,18,NULL);
INSERT INTO upgrade_contacts VALUES(34,18,NULL);
CREATE TABLE upgrade_areas (
    upgrade_id INTEGER NOT NULL REFERENCES upgrades(id) ON DELETE CASCADE,
    area_item_id INTEGER NOT NULL REFERENCES area_items(id) ON DELETE CASCADE,
    PRIMARY KEY (upgrade_id, area_item_id)
);
INSERT INTO upgrade_areas VALUES(4,23);
INSERT INTO upgrade_areas VALUES(10,7);
INSERT INTO upgrade_areas VALUES(22,24);
INSERT INTO upgrade_areas VALUES(8,10);
INSERT INTO upgrade_areas VALUES(28,20);
INSERT INTO upgrade_areas VALUES(17,19);
INSERT INTO upgrade_areas VALUES(15,17);
INSERT INTO upgrade_areas VALUES(19,25);
INSERT INTO upgrade_areas VALUES(55,5);
INSERT INTO upgrade_areas VALUES(44,13);
INSERT INTO upgrade_areas VALUES(44,3);
INSERT INTO upgrade_areas VALUES(44,23);
INSERT INTO upgrade_areas VALUES(44,12);
INSERT INTO upgrade_areas VALUES(44,9);
INSERT INTO upgrade_areas VALUES(44,8);
INSERT INTO upgrade_areas VALUES(44,7);
INSERT INTO upgrade_areas VALUES(50,13);
INSERT INTO upgrade_areas VALUES(51,12);
INSERT INTO upgrade_areas VALUES(13,3);
INSERT INTO upgrade_areas VALUES(45,17);
INSERT INTO upgrade_areas VALUES(12,13);
INSERT INTO upgrade_areas VALUES(12,14);
INSERT INTO upgrade_areas VALUES(2,2);
INSERT INTO upgrade_areas VALUES(3,11);
INSERT INTO upgrade_areas VALUES(23,24);
INSERT INTO upgrade_areas VALUES(16,1);
INSERT INTO upgrade_areas VALUES(74,1);
INSERT INTO upgrade_areas VALUES(11,1);
INSERT INTO upgrade_areas VALUES(26,1);
INSERT INTO upgrade_areas VALUES(75,17);
INSERT INTO upgrade_areas VALUES(18,25);
INSERT INTO upgrade_areas VALUES(53,19);
INSERT INTO upgrade_areas VALUES(9,9);
INSERT INTO upgrade_areas VALUES(91,26);
INSERT INTO upgrade_areas VALUES(95,13);
INSERT INTO upgrade_areas VALUES(88,20);
INSERT INTO upgrade_areas VALUES(34,27);
INSERT INTO upgrade_areas VALUES(71,10);
INSERT INTO upgrade_areas VALUES(105,27);
INSERT INTO upgrade_areas VALUES(29,14);
CREATE TABLE upgrade_area_groups (
    upgrade_id INTEGER NOT NULL REFERENCES upgrades(id) ON DELETE CASCADE,
    area_group_id INTEGER NOT NULL REFERENCES area_groups(id) ON DELETE CASCADE,
    PRIMARY KEY (upgrade_id, area_group_id)
);
INSERT INTO upgrade_area_groups VALUES(4,1);
INSERT INTO upgrade_area_groups VALUES(4,3);
INSERT INTO upgrade_area_groups VALUES(1,4);
INSERT INTO sqlite_sequence VALUES('assets',70);
INSERT INTO sqlite_sequence VALUES('area_items',29);
INSERT INTO sqlite_sequence VALUES('paint_swatches',1);
INSERT INTO sqlite_sequence VALUES('upgrades',105);
CREATE VIEW assets_by_location AS
SELECT
  a.*,
  ag.name as area_group_name,
  ai.name as area_item_name,
  c.name as category_name
FROM assets a
LEFT JOIN area_groups ag ON a.area_group_id = ag.id
LEFT JOIN area_items ai ON a.area_item_id = ai.id
LEFT JOIN asset_categories c ON a.category_id = c.id;
CREATE VIEW active_upgrades AS
SELECT *
FROM upgrades
WHERE phase IN ('idea', 'planning', 'in_progress')
ORDER BY
    CASE phase
        WHEN 'in_progress' THEN 1
        WHEN 'planning' THEN 2
        WHEN 'idea' THEN 3
    END,
    CASE priority
        WHEN 'urgent' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
        WHEN 'someday' THEN 5
    END,
    created_at;
CREATE VIEW maintenance_due AS
SELECT
    mt.id,
    mt.name,
    mt.frequency_days,
    mt.frequency_label,
    mt.estimated_minutes,
    mt.notes,
    mt.omnifocus_task_id,
    -- Aggregate linked assets
    GROUP_CONCAT(DISTINCT a.id) as asset_ids,
    GROUP_CONCAT(DISTINCT a.name) as asset_names,
    GROUP_CONCAT(DISTINCT CASE
        WHEN ag.name IS NOT NULL AND ai.name IS NOT NULL THEN ag.name || ' › ' || ai.name
        ELSE NULL
    END) as area_paths,
    -- Aggregate linked contacts
    GROUP_CONCAT(DISTINCT c.id) as contact_ids,
    GROUP_CONCAT(DISTINCT c.name) as contact_names
FROM maintenance_tasks mt
LEFT JOIN maintenance_assets ma ON mt.id = ma.task_id
LEFT JOIN assets a ON ma.asset_id = a.id
LEFT JOIN area_groups ag ON a.area_group_id = ag.id
LEFT JOIN area_items ai ON a.area_item_id = ai.id
LEFT JOIN maintenance_contacts mc ON mt.id = mc.task_id
LEFT JOIN contacts c ON mc.contact_id = c.id
WHERE mt.frequency_days > 0  -- Only recurring tasks
GROUP BY mt.id
ORDER BY mt.name
;
CREATE INDEX idx_contacts_favorite ON contacts(is_favorite);
CREATE INDEX idx_contact_tags_tag ON contact_tags(tag);
CREATE INDEX idx_assets_area_group ON assets(area_group_id);
CREATE INDEX idx_assets_area_item ON assets(area_item_id);
CREATE INDEX idx_area_items_group ON area_items(group_id);
CREATE INDEX idx_paint_swatches_area_item ON paint_swatches(area_item_id);
CREATE INDEX idx_maintenance_assets_task ON maintenance_assets(task_id);
CREATE INDEX idx_maintenance_assets_asset ON maintenance_assets(asset_id);
CREATE INDEX idx_maintenance_contacts_task ON maintenance_contacts(task_id);
CREATE INDEX idx_maintenance_contacts_contact ON maintenance_contacts(contact_id);
CREATE INDEX idx_maintenance_tasks_appliance ON maintenance_tasks(id);
CREATE INDEX idx_upgrades_phase ON upgrades(phase);
CREATE INDEX idx_upgrades_priority ON upgrades(priority);
CREATE INDEX idx_upgrades_category ON upgrades(category);
CREATE INDEX idx_upgrade_assets_upgrade ON upgrade_assets(upgrade_id);
CREATE INDEX idx_upgrade_assets_asset ON upgrade_assets(asset_id);
CREATE INDEX idx_upgrade_paints_upgrade ON upgrade_paints(upgrade_id);
CREATE INDEX idx_upgrade_paints_paint ON upgrade_paints(paint_id);
CREATE INDEX idx_upgrade_contacts_upgrade ON upgrade_contacts(upgrade_id);
CREATE INDEX idx_upgrade_contacts_contact ON upgrade_contacts(contact_id);
CREATE INDEX idx_upgrade_areas_upgrade ON upgrade_areas(upgrade_id);
CREATE INDEX idx_upgrade_areas_area ON upgrade_areas(area_item_id);
CREATE INDEX idx_upgrade_area_groups_upgrade ON upgrade_area_groups(upgrade_id);
CREATE INDEX idx_upgrade_area_groups_group ON upgrade_area_groups(area_group_id);
COMMIT;
